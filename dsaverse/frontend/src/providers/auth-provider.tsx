"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  syncUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken, isAuthenticated, logout, updateUser } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Sync user profile from backend
  const syncUser = async () => {
    if (!accessToken) return;
    try {
      const response = await apiClient.get("/auth/me");
      if (response.data?.data) {
        updateUser(response.data.data);
      }
    } catch (error) {
      console.error("Failed to sync user context", error);
      // If unauthorized, log out the user
      if (axiosIsUnauthorizedError(error)) {
        logout();
      }
    }
  };

  // Helper to detect unauthorized axios errors
  const axiosIsUnauthorizedError = (err: any) => {
    const status = err?.response?.status;
    return status === 401 || status === 400;
  };

  // 1. Wait for Zustand storage hydration on client
  useEffect(() => {
    // Zustand persists store in localStorage. When loaded, it hydrates.
    // By checking if state is ready, we avoid SSR hydration mismatch.
    setIsHydrated(true);
  }, []);

  // 2. Fetch fresh user details when authenticated
  useEffect(() => {
    if (isHydrated && isAuthenticated && accessToken) {
      syncUser();
    }
  }, [isHydrated, isAuthenticated, accessToken]);

  // 3. Navigation and Route Guarding
  useEffect(() => {
    if (!isHydrated) return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!isAuthenticated && !isPublic) {
      // User is not authenticated and trying to access a protected page
      router.push("/login");
    } else if (isAuthenticated && isPublic && pathname !== "/") {
      // User is authenticated and trying to access login/register
      router.push("/dashboard");
    }
  }, [isHydrated, isAuthenticated, user, pathname, router]);

  // Render a baseline loading spinner until Zustand is hydrated on client
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ syncUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
