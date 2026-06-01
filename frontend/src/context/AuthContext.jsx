import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "nutrivision_users";
const ACTIVE_USER_KEY = "nutrivision_active_user";
const IMAGE_STORAGE_KEY = "nutrivision_profile_image";

function safeParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    console.warn(
      "[AuthContext] Corrupted localStorage data — resetting to default.",
    );
    return fallback;
  }
}

function loadUsers() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParse(raw, {});
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {}
}

function loadActiveUserId() {
  try {
    return localStorage.getItem(ACTIVE_USER_KEY) || null;
  } catch {
    return null;
  }
}

function saveProfileImage(imageDataUrl) {
  try {
    localStorage.setItem(IMAGE_STORAGE_KEY, imageDataUrl || "");
  } catch {}
}

function loadProfileImage() {
  try {
    return localStorage.getItem(IMAGE_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers());
  const [activeUserId, setActiveUserId] = useState(() => loadActiveUserId());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    if (activeUserId) {
      try {
        localStorage.setItem(ACTIVE_USER_KEY, activeUserId);
      } catch {}
    } else {
      try {
        localStorage.removeItem(ACTIVE_USER_KEY);
      } catch {}
    }
  }, [activeUserId]);

  const hasUsers = Object.keys(users).length > 0;

  const registerUser = (name, email, password) => {
    const lowerEmail = email.trim().toLowerCase();
    if (users[lowerEmail]) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }
    const newUser = {
      id: lowerEmail,
      name: name.trim(),
      email: lowerEmail,
      password,
      hasCompletedOnboarding: false,
      profile: {
        fullName: name.trim(),
        email: lowerEmail,
        age: "",
        gender: "",
        weight: "",
        height: "",
      },
      profileImage: null,
      savedRecipes: [],
      completedRecipes: [],
    };
    setUsers((prev) => ({ ...prev, [lowerEmail]: newUser }));
    setActiveUserId(lowerEmail);
    return { success: true };
  };

  const login = (email, password) => {
    const lowerEmail = email.trim().toLowerCase();
    const user = users[lowerEmail];
    if (!user) {
      return { success: false, error: "No account found with this email." };
    }
    if (user.password !== password) {
      return { success: false, error: "Incorrect password." };
    }
    setActiveUserId(lowerEmail);
    return { success: true };
  };

  const logout = () => {
    setActiveUserId(null);
  };

  const getActiveUser = () => {
    if (!activeUserId) return null;
    let user = users[activeUserId] || null;

    if (user && !user.profileImage) {
      const stored = loadProfileImage();
      if (stored) {
        user = { ...user, profileImage: stored };
      }
    }
    return user;
  };

  const getActiveProfileImage = () => {
    if (!activeUserId) return null;
    return loadProfileImage();
  };

  const updateActiveUser = (data) => {
    if (!activeUserId) return;
    setUsers((prev) => {
      if (!prev[activeUserId]) return prev;
      return {
        ...prev,
        [activeUserId]: { ...prev[activeUserId], ...data },
      };
    });
  };

  const updateActiveProfile = (profileData) => {
    if (!activeUserId) return;
    setUsers((prev) => {
      if (!prev[activeUserId]) return prev;
      return {
        ...prev,
        [activeUserId]: {
          ...prev[activeUserId],
          profile: { ...prev[activeUserId].profile, ...profileData },
        },
      };
    });
  };

  const updateActiveProfileImage = (imageDataUrl) => {
    if (!activeUserId) return;

    saveProfileImage(imageDataUrl);

    setUsers((prev) => {
      if (!prev[activeUserId]) return prev;
      return {
        ...prev,
        [activeUserId]: { ...prev[activeUserId], profileImage: imageDataUrl },
      };
    });
  };

  const completeOnboarding = () => {
    if (!activeUserId) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const all = safeParse(raw, {});
      if (all[activeUserId]) {
        all[activeUserId].hasCompletedOnboarding = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      }
    } catch {}
    setUsers((prev) => {
      if (!prev[activeUserId]) return prev;
      return {
        ...prev,
        [activeUserId]: { ...prev[activeUserId], hasCompletedOnboarding: true },
      };
    });
  };

  const updateUserPassword = (currentPassword, newPassword) => {
    if (!activeUserId) return { success: false, error: "Not logged in." };
    const user = users[activeUserId];
    if (!user) return { success: false, error: "User not found." };
    if (user.password !== currentPassword)
      return { success: false, error: "Current password is incorrect." };
    if (newPassword.length < 8)
      return {
        success: false,
        error: "Password must be at least 8 characters.",
      };
    setUsers((prev) => {
      if (!prev[activeUserId]) return prev;
      return {
        ...prev,
        [activeUserId]: { ...prev[activeUserId], password: newPassword },
      };
    });
    return { success: true };
  };

  const toggleSavedRecipe = (recipeId) => {
    if (!activeUserId) return;
    setUsers((prev) => {
      if (!prev[activeUserId]) return prev;
      const user = prev[activeUserId];
      const saved = user.savedRecipes || [];
      const next = saved.includes(recipeId)
        ? saved.filter((id) => id !== recipeId)
        : [...saved, recipeId];
      return { ...prev, [activeUserId]: { ...user, savedRecipes: next } };
    });
  };

  const toggleCompletedRecipe = (recipeId) => {
    if (!activeUserId) return;
    setUsers((prev) => {
      if (!prev[activeUserId]) return prev;
      const user = prev[activeUserId];
      const completed = user.completedRecipes || [];
      const next = completed.includes(recipeId)
        ? completed.filter((id) => id !== recipeId)
        : [...completed, recipeId];
      return { ...prev, [activeUserId]: { ...user, completedRecipes: next } };
    });
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!activeUserId,
        activeUserId,
        hasUsers,
        users,
        isLoading,
        registerUser,
        login,
        logout,
        getActiveUser,
        getActiveProfileImage,
        updateActiveUser,
        updateActiveProfile,
        updateActiveProfileImage,
        updateUserPassword,
        completeOnboarding,
        toggleSavedRecipe,
        toggleCompletedRecipe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
