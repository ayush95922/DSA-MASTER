import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { CompanySummary, CompanyDetail } from "@/types/company";

// 1. Query all company interview targets with active user readiness scores
export function useCompaniesList() {
  return useQuery<CompanySummary[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await apiClient.get("/companies");
      return response.data?.data;
    },
  });
}

// 2. Query detailed round requirements by slug
export function useCompanyDetail(slug: string) {
  return useQuery<CompanyDetail>({
    queryKey: ["company", slug],
    queryFn: async () => {
      const response = await apiClient.get(`/companies/${slug}`);
      return response.data?.data;
    },
    enabled: !!slug,
  });
}

export function useCompanies() {
  return {
    useCompaniesList,
    useCompanyDetail,
  };
}
