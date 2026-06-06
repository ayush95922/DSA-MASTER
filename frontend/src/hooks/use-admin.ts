import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface SettingInfo {
  key: string;
  value: string;
  description: string;
}

export interface ImportInfo {
  id: number;
  fileName: string;
  status: string;
  recordsProcessed: number;
  errors: string;
  importedBy: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalQuestions: number;
  totalTopics: number;
  totalRoadmaps: number;
  totalAttempts: number;
  settings: SettingInfo[];
  recentImports: ImportInfo[];
}

export interface AuditLog {
  id: number;
  action: string;
  entityName: string;
  entityId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export function useAdmin() {
  const queryClient = useQueryClient();

  // 1. Fetch admin stats
  const useAdminStats = () =>
    useQuery<AdminDashboardStats>({
      queryKey: ["admin", "stats"],
      queryFn: async () => {
        const response = await apiClient.get("/admin/dashboard");
        return response.data?.data;
      },
    });

  // 2. Fetch audit logs
  const useAuditLogs = () =>
    useQuery<AuditLog[]>({
      queryKey: ["admin", "audit-logs"],
      queryFn: async () => {
        const response = await apiClient.get("/admin/audit-logs");
        return response.data?.data;
      },
    });

  // 3. Update a system configuration setting
  const useUpdateSetting = () =>
    useMutation({
      mutationFn: async ({ key, value }: { key: string; value: string }) => {
        await apiClient.put(`/admin/settings/${key}`, { value });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      },
    });

  // 4. Submit a batch upload questions request
  const useBulkImport = () =>
    useMutation({
      mutationFn: async (payload: { fileName: string; questions: any[] }) => {
        await apiClient.post("/admin/import", payload);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
        queryClient.invalidateQueries({ queryKey: ["questions"] });
      },
    });

  return {
    useAdminStats,
    useAuditLogs,
    useUpdateSetting,
    useBulkImport,
  };
}
