"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync NextAuth session to user state
  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (session?.user) {
      const u = session.user;
      const userData: User = {
        id: (u as { id?: string }).id ?? u.email ?? "",
        email: u.email ?? "",
        name: u.name ?? undefined,
      };
      setUser(userData);
      setIsGuest(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("squidai_guest");
        localStorage.setItem("squidai_auth", JSON.stringify({ user: userData, provider: "google" }));
      }

      // Save to MongoDB
      fetch("/api/users/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData.id,
          email: userData.email,
          name: userData.name,
        }),
      }).catch(() => {});
      setLoading(false);
      return;
    }

    // Fallback to localStorage when no NextAuth session
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    try {
      const storedAuth = localStorage.getItem("squidai_auth");
      const storedGuest = localStorage.getItem("squidai_guest");

      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        if (authData.provider !== "google") {
          setUser(authData.user);
        }
      }

      if (storedGuest === "true") {
        setIsGuest(true);
      }
    } catch (error) {
      console.error("Failed to load auth state:", error);
    } finally {
      setLoading(false);
    }
  }, [session, sessionStatus]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- password reserved for future API auth
  const login = useCallback(async (email: string, password: string) => {
    const userData: User = {
      id: crypto.randomUUID(),
      email: email,
      name: email.split("@")[0],
    };

    const authData = {
      user: userData,
      token: "mock_token_" + Date.now(),
    };

    localStorage.setItem("squidai_auth", JSON.stringify(authData));
    localStorage.removeItem("squidai_guest");
    setUser(userData);
    setIsGuest(false);

    // Save user to MongoDB (fire-and-forget)
    fetch("/api/users/upsert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userData.id, email: userData.email, name: userData.name }),
    }).catch(() => {});
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const userData: User = {
      id: crypto.randomUUID(),
      email: email,
      name: name || email.split("@")[0],
    };

    const authData = {
      user: userData,
      token: "mock_token_" + Date.now(),
    };

    localStorage.setItem("squidai_auth", JSON.stringify(authData));
    localStorage.removeItem("squidai_guest");
    setUser(userData);
    setIsGuest(false);

    // Save user to MongoDB (fire-and-forget)
    fetch("/api/users/upsert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userData.id, email: userData.email, name: userData.name }),
    }).catch(() => {});
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await nextAuthSignIn("google", { callbackUrl: "/" });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("squidai_auth");
    localStorage.removeItem("squidai_guest");
    setUser(null);
    setIsGuest(false);
    if (session) {
      nextAuthSignOut({ callbackUrl: "/" });
    } else {
      window.location.href = "/";
    }
  }, [session]);

  const continueAsGuest = useCallback(() => {
    localStorage.setItem("squidai_guest", "true");
    localStorage.removeItem("squidai_auth");
    setUser(null);
    setIsGuest(true);
  }, []);

  const isLoading = loading || sessionStatus === "loading";

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isGuest,
    login,
    register,
    signInWithGoogle,
    logout,
    continueAsGuest,
    loading: isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

