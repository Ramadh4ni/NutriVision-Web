import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const UserContext = createContext(null);

const defaultProfile = {
  fullName: "",
  email: "",
  age: "",
  gender: "",
  weight: "",
  height: "",
  goal: "",
  activityLevel: "",
};

export function UserProvider({ children }) {
  const { profile: authProfile } = useAuth();
  const [profile, setProfile] = useState(defaultProfile);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authProfile) {
      setProfile({
        ...defaultProfile,
        ...authProfile,
      });
    } else {
      setProfile(defaultProfile);
      setProfileImage(null);
    }
  }, [authProfile]);

  const value = useMemo(
    () => ({
      profile,
      profileImage,
      loading,
      updateProfile: (data) => setProfile((prev) => ({ ...prev, ...data })),
      updateProfileImage: async (imageDataUrl) => {
        setProfileImage(imageDataUrl);
      },
      hydrateFromAuth: (data) => {
        if (data) {
          setProfile((prev) => ({ ...prev, ...data }));
        } else {
          setProfile(defaultProfile);
          setProfileImage(null);
        }
      },
    }),
    [profile, profileImage, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
