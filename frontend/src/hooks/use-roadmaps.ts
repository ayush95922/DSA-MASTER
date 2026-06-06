import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { RoadmapSummary, RoadmapDetail } from "@/types/roadmap";
import { toast } from "sonner";

export function useRoadmaps() {
  const queryClient = useQueryClient();

  // 1. Query all roadmaps
  const useRoadmapsList = () =>
    useQuery<RoadmapSummary[]>({
      queryKey: ["roadmaps"],
      queryFn: async () => {
        const response = await apiClient.get("/roadmaps");
        return response.data?.data;
      },
    });

  // 2. Query a single detailed roadmap by slug
  const useRoadmapDetail = (slug: string) =>
    useQuery<RoadmapDetail>({
      queryKey: ["roadmap", slug],
      queryFn: async () => {
        const response = await apiClient.get(`/roadmaps/${slug}`);
        return response.data?.data;
      },
      enabled: !!slug,
    });

  // 3. Mutation to enroll in a roadmap
  const enrollMutation = useMutation({
    mutationFn: async (slug: string) => {
      const response = await apiClient.post(`/roadmaps/${slug}/enroll`);
      return response.data;
    },
    onSuccess: (_, slug) => {
      toast.success("Successfully enrolled in learning path!");
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap", slug] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to enroll. Please try again.";
      toast.error(message);
    },
  });

  // 4. Mutation to mark a roadmap node as completed
  const completeNodeMutation = useMutation({
    mutationFn: async ({ nodeId, slug }: { nodeId: number; slug: string }) => {
      const response = await apiClient.post(`/roadmaps/nodes/${nodeId}/complete`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Step checked off successfully!");
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update step progress.";
      toast.error(message);
    },
  });

  return {
    useRoadmapsList,
    useRoadmapDetail,
    enroll: (slug: string) => enrollMutation.mutate(slug),
    isEnrolling: enrollMutation.isPending,
    completeNode: (nodeId: number, slug: string) =>
      completeNodeMutation.mutate({ nodeId, slug }),
    isCompletingNode: completeNodeMutation.isPending,
  };
}
