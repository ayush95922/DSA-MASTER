import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserProfile {
  fullName: string | null;
  avatar: string | null;
  bio: string | null;
  college: string | null;
  graduationYear: number | null;
  dsaLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  targetCompanies: string[];
  onboarded: boolean;
}

export interface UserSettings {
  theme: "LIGHT" | "DARK" | "SYSTEM";
  notificationsEnabled: boolean;
  dailyQuestionGoal: number;
  preferredLanguage: "JAVA" | "PYTHON" | "CPP";
}

export interface User {
  id: number;
  email: string;
  username: string;
  status: string;
  roles: string[];
  profile: UserProfile | null;
  settings: UserSettings | null;
}

const mapUserFromBackend = (backendUser: any): User | null => {
  if (!backendUser) return null;
  if (backendUser.profile) return backendUser;

  return {
    id: backendUser.id,
    email: backendUser.email,
    username: backendUser.username,
    status: backendUser.status || "ACTIVE",
    roles: backendUser.roles || [],
    settings: backendUser.settings || null,
    profile: {
      fullName: backendUser.fullName || null,
      avatar: backendUser.avatarUrl || null,
      bio: backendUser.bio || null,
      college: backendUser.college || null,
      graduationYear: backendUser.graduationYear || null,
      dsaLevel: backendUser.level || "BEGINNER",
      targetCompanies: backendUser.targetCompanies || [],
      onboarded: backendUser.onboardingCompleted ?? true,
    }
  };
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  updateUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (accessToken, refreshToken, user) =>
        set({
          accessToken,
          refreshToken,
          user: mapUserFromBackend(user),
          isAuthenticated: true,
          isLoading: false,
        }),

      updateUser: (user) => set({ user: mapUserFromBackend(user) }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: "dsaverse-auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist tokens and user info, not loading state
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
