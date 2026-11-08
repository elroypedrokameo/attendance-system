import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { User } from "@/context/AuthContext";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const authKeys = {
  all: ["auth"] as const,
  profile: (token: string | null) =>
    [...authKeys.all, "profile", token] as const,
};

export const useProfile = (token: string | null) => {
  return useQuery({
    queryKey: authKeys.profile(token),
    queryFn: async () => {
      const res = await apiClient.get("/auth/profile");
      if (res.data?.success) {
        localStorage.setItem("dexa_user", JSON.stringify(res.data.data));
        return res.data.data as User;
      }
      throw new Error("Failed to load profile");
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<LoginResponse> => {
      const res = await apiClient.post("/auth/login", payload);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Invalid email or password");
      }
      return res.data.data;
    },
  });
};

export const useAuthCache = () => {
  const queryClient = useQueryClient();

  const setProfileCache = (token: string, user: User) => {
    queryClient.setQueryData(authKeys.profile(token), user);
  };

  const clearAllCache = () => {
    queryClient.clear();
  };

  return { setProfileCache, clearAllCache };
};

