import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ProfileData {
  fullName: string;
  insuranceNumber: string;
  contactName: string;
  contactPhone: string;
  nationality?: string;
  dateOfBirth?: string;
  medicalNotes?: string;
}

interface ProfileContextType {
  profile: ProfileData | null;
  setProfile: (profile: ProfileData | null) => void;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<ProfileData | null>(null);

  const setProfile = useCallback((p: ProfileData | null) => {
    setProfileState(p);
  }, []);

  const refreshProfile = useCallback(() => {
    setProfileState((prev) => prev);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
