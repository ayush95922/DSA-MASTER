import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { CategorySummary, TopicDetail } from "@/types/topic";

export function useTopics() {
  // 1. Query all categories with child topics & progress metrics
  const useCategoriesList = () =>
    useQuery<CategorySummary[]>({
      queryKey: ["categories"],
      queryFn: async () => {
        const response = await apiClient.get("/topics/categories");
        return response.data?.data;
      },
    });

  // 2. Query a single detailed topic by slug
  const useTopicDetail = (slug: string) =>
    useQuery<TopicDetail>({
      queryKey: ["topic", slug],
      queryFn: async () => {
        const response = await apiClient.get(`/topics/${slug}`);
        return response.data?.data;
      },
      enabled: !!slug,
    });

  return {
    useCategoriesList,
    useTopicDetail,
  };
}
