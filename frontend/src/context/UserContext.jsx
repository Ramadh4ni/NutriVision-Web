import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const defaultProfile = {
  fullName: '',
  email: '',
  age: '',
  gender: '',
  weight: '',
  height: '',
};

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateProfile = (data) => {
    
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const updateProfileImage = (imageDataUrl) => {
    return new Promise((resolve) => {
      setProfileImage(imageDataUrl);
      resolve();
    });
  };

  
  const hydrateFromAuth = (user) => {
    if (user?.profile) {
      setProfile({
        fullName: user.profile.fullName || '',
        email: user.profile.email || '',
        age: user.profile.age || '',
        gender: user.profile.gender || '',
        weight: user.profile.weight || '',
        height: user.profile.height || '',
      });
    } else {
      setProfile(defaultProfile);
    }
    setProfileImage(user?.profileImage || null);
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        profileImage,
        updateProfile,
        updateProfileImage,
        loading,
        hydrateFromAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}