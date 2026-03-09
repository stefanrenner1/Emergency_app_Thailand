import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const CONSENT_KEY = "emergency_app_privacy_consent";

interface ConsentContextType {
  hasConsented: boolean;
  setConsented: () => void;
  isLoading: boolean;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsented, setHasConsentedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    setHasConsentedState(stored === "true");
    setIsLoading(false);
  }, []);

  const setConsented = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    setHasConsentedState(true);
  };

  return (
    <ConsentContext.Provider value={{ hasConsented, setConsented, isLoading }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return context;
}
