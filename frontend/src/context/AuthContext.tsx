import React, { createContext, useContext, useState, useEffect } from "react";
import { useProfile, useAuthCache } from "@/hooks/useAuthApi";

export interface User {
  id: number;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  employeeId: number | null;
  name: string;
  department?: string | null;
  position?: string | null;
  employeeCode?: string | null;
  phone?: string | null;
  joinDate?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setProfileCache, clearAllCache } = useAuthCache();

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("dexa_token");
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("dexa_user");
    return saved ? JSON.parse(saved) : null;
  });

  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
    isError,
  } = useProfile(token);

  useEffect(() => {
    if (profileData) {
      setUser(profileData);
    }
  }, [profileData]);

  const logout = () => {
    localStorage.removeItem("dexa_token");
    localStorage.removeItem("dexa_user");
    setToken(null);
    setUser(null);
    clearAllCache();
  };

  useEffect(() => {
    if (isError && token) {
      logout();
    }
  }, [isError, token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("dexa_token", newToken);
    localStorage.setItem("dexa_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setProfileCache(newToken, newUser);
  };

  const refreshProfile = async () => {
    await refetch();
  };

  const isLoading = Boolean(token) && isProfileLoading && !user;

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
