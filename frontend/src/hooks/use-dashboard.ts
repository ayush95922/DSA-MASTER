import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { DashboardData } from "@/types/progress";

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/summary");
      return response.data?.data;
    },
    refetchOnWindowFocus: true,
  });
}
