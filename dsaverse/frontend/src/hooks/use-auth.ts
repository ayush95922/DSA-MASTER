import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { user, accessToken, isAuthenticated, setAuth, logout: storeLogout, isLoading: storeLoading } = useAuthStore();
  const router = useRouter();

  // 1. Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data?.data;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data;
      setAuth(accessToken, refreshToken, user);
      toast.success("Welcome back! Login successful.");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      let message = "Invalid credentials. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          message = response.data.message;
        }
      }
      toast.error(message);
    },
  });

  // 2. Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: Record<string, unknown>) => {
      const response = await apiClient.post("/auth/register", userData);
      return response.data?.data;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data;
      setAuth(accessToken, refreshToken, user);
      toast.success("Account created successfully! Welcome to DSAverse.");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      let message = "Registration failed. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          message = response.data.message;
        }
      }
      toast.error(message);
    },
  });

  // 3. Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      await apiClient.post("/auth/logout", { refreshToken });
    },
    onSuccess: () => {
      storeLogout();
      toast.info("Logged out successfully.");
      router.push("/login");
    },
    onError: () => {
      // Even if API logout fails, clear client state
      storeLogout();
      toast.info("Logged out.");
      router.push("/login");
    },
  });

  // 4. Forgot Password Mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiClient.post("/auth/forgot-password", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset instructions sent to your email!");
    },
    onError: (error: unknown) => {
      let message = "Failed to process request.";
      if (error && typeof error === "object" && "response" in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          message = response.data.message;
        }
      }
      toast.error(message);
    },
  });

  // 5. Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const response = await apiClient.post("/auth/reset-password", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset successful! Please log in with your new password.");
      router.push("/login");
    },
    onError: (error: unknown) => {
      let message = "Password reset failed.";
      if (error && typeof error === "object" && "response" in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          message = response.data.message;
        }
      }
      toast.error(message);
    },
  });

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending || storeLoading,
    login: (credentials: Record<string, string>) => loginMutation.mutate(credentials),
    register: (userData: Record<string, unknown>) => registerMutation.mutate(userData),
    logout: () => logoutMutation.mutate(),
    forgotPassword: (email: string) => forgotPasswordMutation.mutate({ email }),
    resetPassword: (data: Record<string, string>) => resetPasswordMutation.mutate(data),
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
