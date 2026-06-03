import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AnalyticsOverview } from "@/types/analytics";

export function useAnalytics() {
  const useAnalyticsOverview = () =>
    useQuery<AnalyticsOverview>({
      queryKey: ["analytics", "overview"],
      queryFn: async () => {
        const response = await apiClient.get("/analytics/overview");
        return response.data?.data;
      },
    });

  return {
    useAnalyticsOverview,
  };
}
