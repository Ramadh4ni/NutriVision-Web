import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearSessionTokens,
  getDashboard,
  getMe,
  login as loginRequest,
  loginGoogle,
  logout as logoutRequest,
  mapProfileFromApi,
  refreshSession,
  register as registerRequest,
  saveOnboarding,
  setSessionTokens,
  updateAccountPassword,
  updateAccountProfile,
  getAccessToken,
  getRefreshToken,
} from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapSession();
  }, []);

  async function bootstrapSession() {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken && !refreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      const me = await getMe();
      const user = me.data.user;
      setCurrentUser(user);
      await hydrateUserData(user);
    } catch (_error) {
      if (refreshToken) {
        try {
          const refreshed = await refreshSession();
          setSessionTokens(refreshed.data.tokens);
          const me = await getMe();
          const user = me.data.user;
          setCurrentUser(user);
          await hydrateUserData(user);
        } catch {
          clearSessionTokens();
          setCurrentUser(null);
          setProfile(null);
          setDashboard(null);
        }
      } else {
        clearSessionTokens();
        setCurrentUser(null);
        setProfile(null);
        setDashboard(null);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function hydrateUserData(user) {
    try {
      const dashboardResponse = await getDashboard();
      setDashboard(dashboardResponse.data);
      setProfile(mapProfileFromApi(dashboardResponse.data.profile, user));
      return dashboardResponse.data;
    } catch {
      setDashboard(null);
      setProfile(mapProfileFromApi(null, user));
      return null;
    }
  }

  async function registerUser(name, email, password) {
    try {
      const result = await registerRequest({
        fullName: name,
        email,
        password,
      });
      setSessionTokens(result.data.tokens);
      setCurrentUser(result.data.user);
      setProfile(
        mapProfileFromApi(null, {
          fullName: result.data.user.fullName,
          email: result.data.user.email,
        })
      );
      setDashboard(null);
      return { success: true, hasCompletedOnboarding: false };
    } catch (error) {
      return {
        success: false,
        error: error.payload?.message || error.message,
      };
    }
  }

  async function login(email, password) {
    try {
      const result = await loginRequest({ email, password });
      setSessionTokens(result.data.tokens);
      setCurrentUser(result.data.user);
      const dashboardData = await hydrateUserData(result.data.user);
      return {
        success: true,
        hasCompletedOnboarding: !!dashboardData?.profile,
      };
    } catch (error) {
      return {
        success: false,
        error: error.payload?.message || error.message,
      };
    }
  }

  async function loginWithGoogle(payload) {
    try {
      // payload can be { credential } (ID token) or { email, fullName, googleId } (from userinfo)
      const result = await loginGoogle(payload);
      setSessionTokens(result.data.tokens);
      setCurrentUser(result.data.user);
      const dashboardData = await hydrateUserData(result.data.user);
      return {
        success: true,
        hasCompletedOnboarding: !!dashboardData?.profile,
      };
    } catch (error) {
      return {
        success: false,
        error: error.payload?.message || error.message,
      };
    }
  }

  async function completeOnboarding(profileData) {
    await saveOnboarding({
      age: Number(profileData.age),
      gender: profileData.gender,
      weightKg: Number(profileData.weight),
      heightCm: Number(profileData.height),
      goal: profileData.goal,
      activityLevel: profileData.activityLevel,
    });
    const dashboardResponse = await getDashboard();
    setDashboard(dashboardResponse.data);
    setProfile(mapProfileFromApi(dashboardResponse.data.profile, currentUser));
    return dashboardResponse.data;
  }

  async function updateActiveProfile(profileData) {
    const payload = {};
    if (profileData.age !== undefined) payload.age = Number(profileData.age);
    if (profileData.gender !== undefined) payload.gender = profileData.gender;
    if (profileData.weight !== undefined) payload.weightKg = Number(profileData.weight);
    if (profileData.height !== undefined) payload.heightCm = Number(profileData.height);
    if (profileData.goal !== undefined) payload.goal = profileData.goal;
    if (profileData.activityLevel !== undefined) payload.activityLevel = profileData.activityLevel;

    const result = await updateAccountProfile(payload);
    const nextProfile = mapProfileFromApi(result.data, currentUser);
    setProfile((prev) => ({
      ...prev,
      ...nextProfile,
      fullName: profileData.fullName ?? prev?.fullName ?? currentUser?.fullName ?? "",
      email: profileData.email ?? prev?.email ?? currentUser?.email ?? "",
    }));
    const dashboardResponse = await getDashboard();
    setDashboard(dashboardResponse.data);
    return result.data;
  }

  async function updateUserPassword(currentPassword, newPassword) {
    try {
      await updateAccountPassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.payload?.message || error.message,
      };
    }
  }

  async function logout() {
    try {
      await logoutRequest();
    } catch {}
    clearSessionTokens();
    setCurrentUser(null);
    setProfile(null);
    setDashboard(null);
  }

  const value = useMemo(
    () => ({
      isAuthenticated: !!currentUser,
      currentUser,
      profile,
      dashboard,
      isLoading,
      hasCompletedOnboarding: !!dashboard?.profile,
      registerUser,
      login,
      loginWithGoogle,
      logout,
      completeOnboarding,
      updateActiveProfile,
      updateUserPassword,
      refreshUserData: async () => {
        if (!currentUser) return;
        await hydrateUserData(currentUser);
      },
    }),
    [currentUser, profile, dashboard, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
