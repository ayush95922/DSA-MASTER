import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { QuestionSummary, QuestionDetail, EditorialDetail } from "@/types/question";
import { CompanyDetail, CompanyQuestionInfo } from "@/types/company";

export interface SubmissionPayload {
  submittedCode: string;
  language: string;
  status: "SOLVED" | "FAILED" | "ATTEMPTED";
  executionTime?: number;
  memoryUsed?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Standalone named exports — use these in individual pages for stable hook refs
// ─────────────────────────────────────────────────────────────────────────────

export const useQuestionDetail = (slug: string) =>
  useQuery<QuestionDetail>({
    queryKey: ["question", slug],
    queryFn: async () => {
      const response = await apiClient.get(`/questions/${slug}`);
      return response.data?.data;
    },
    enabled: !!slug,
  });

export const useQuestionEditorial = (slug: string) =>
  useQuery<EditorialDetail>({
    queryKey: ["editorial", slug],
    queryFn: async () => {
      const response = await apiClient.get(`/questions/${slug}/editorial`);
      return response.data?.data;
    },
    enabled: !!slug,
  });

export const useSubmitAttempt = (defaultSlug?: string) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { slug?: string; payload: SubmissionPayload } | SubmissionPayload, { prevQuestions?: QuestionSummary[]; prevCompanySnapshots?: Record<string, CompanyDetail> }>({
    mutationFn: async (variables) => {
      let targetSlug = defaultSlug;
      let payload: SubmissionPayload;

      if (variables && typeof variables === "object" && "payload" in variables) {
        const payloadVars = variables as { slug?: string; payload: SubmissionPayload };
        payload = payloadVars.payload;
        if (payloadVars.slug) targetSlug = payloadVars.slug;
      } else {
        payload = variables as SubmissionPayload;
      }

      if (!targetSlug) throw new Error("No question slug provided for submission");
      const response = await apiClient.post(`/progress/questions/${targetSlug}/submit`, payload);
      return response.data?.data;
    },
    onMutate: async (variables) => {
      let targetSlug = defaultSlug;
      let isSolved = true;

      if (variables && typeof variables === "object" && "payload" in variables) {
        const payloadVars = variables as { slug?: string; payload: SubmissionPayload };
        if (payloadVars.slug) targetSlug = payloadVars.slug;
        isSolved = payloadVars.payload.status === "SOLVED";
      } else if (variables && typeof variables === "object" && "status" in variables) {
        isSolved = (variables as SubmissionPayload).status === "SOLVED";
      }

      if (!targetSlug) return { prevQuestions: [], prevCompanySnapshots: {} };

      await queryClient.cancelQueries({ queryKey: ["questions"] });
      await queryClient.cancelQueries({ queryKey: ["company"] });

      const prevQuestions = queryClient.getQueryData<QuestionSummary[]>(["questions"]);
      if (prevQuestions) {
        queryClient.setQueryData<QuestionSummary[]>(
          ["questions"],
          prevQuestions.map((q) =>
            q.slug === targetSlug ? { ...q, status: isSolved ? "SOLVED" : "UNATTEMPTED" } : q
          )
        );
      }

      const activeQueries = queryClient.getQueryCache().getAll();
      const companyQueries = activeQueries.filter((q) => q.queryKey[0] === "company");
      const prevCompanySnapshots: Record<string, CompanyDetail> = {};

      companyQueries.forEach((q) => {
        const key = q.queryKey;
        const data = queryClient.getQueryData<CompanyDetail>(key);
        if (data && data.questions) {
          prevCompanySnapshots[JSON.stringify(key)] = data;
          const hasQuestion = data.questions.some((ques: CompanyQuestionInfo) => ques.slug === targetSlug);
          if (hasQuestion) {
            const updatedQuestions = data.questions.map((ques: CompanyQuestionInfo) =>
              ques.slug === targetSlug ? { ...ques, solved: isSolved } : ques
            );
            const solvedCount = updatedQuestions.filter((ques: CompanyQuestionInfo) => ques.solved).length;
            const totalCount = updatedQuestions.length;
            const readinessPercentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
            queryClient.setQueryData<CompanyDetail>(key, { ...data, questions: updatedQuestions, readinessPercentage });
          }
        }
      });

      return { prevQuestions, prevCompanySnapshots };
    },
    onError: (_err, _variables, context) => {
      if (context?.prevQuestions) queryClient.setQueryData(["questions"], context.prevQuestions);
      if (context?.prevCompanySnapshots) {
        Object.entries(context.prevCompanySnapshots).forEach(([keyStr, oldData]) => {
          queryClient.setQueryData(JSON.parse(keyStr), oldData);
        });
      }
    },
    onSettled: (_, __, variables) => {
      let targetSlug = defaultSlug;
      if (variables && typeof variables === "object" && "slug" in variables && variables.slug) {
        targetSlug = variables.slug as string;
      }
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      if (targetSlug) queryClient.invalidateQueries({ queryKey: ["question", targetSlug] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Factory hook — kept for backward compatibility with other pages
// ─────────────────────────────────────────────────────────────────────────────

export function useQuestions() {
  const queryClient = useQueryClient();

  // 1. Query all questions with user completion status
  const useQuestionsList = () =>
    useQuery<QuestionSummary[]>({
      queryKey: ["questions"],
      queryFn: async () => {
        const response = await apiClient.get("/questions");
        return response.data?.data;
      },
    });

  // 2. Query a single detailed question by slug
  const useQuestionDetail = (slug: string) =>
    useQuery<QuestionDetail>({
      queryKey: ["question", slug],
      queryFn: async () => {
        const response = await apiClient.get(`/questions/${slug}`);
        return response.data?.data;
      },
      enabled: !!slug,
    });

  // 3. Query solutions editorial by question slug
  const useQuestionEditorial = (slug: string) =>
    useQuery<EditorialDetail>({
      queryKey: ["editorial", slug],
      queryFn: async () => {
        const response = await apiClient.get(`/questions/${slug}/editorial`);
        return response.data?.data;
      },
      enabled: !!slug,
    });

  // 4. Submit solution attempt mutation supporting dynamic question slugs, optimistic updates, and rollbacks
  const useSubmitAttempt = (defaultSlug?: string) =>
    useMutation<unknown, Error, { slug?: string; payload: SubmissionPayload } | SubmissionPayload, { prevQuestions?: QuestionSummary[]; prevCompanySnapshots?: Record<string, CompanyDetail> }>({
      mutationFn: async (variables) => {
        let targetSlug = defaultSlug;
        let payload: SubmissionPayload;

        if (variables && typeof variables === "object" && "payload" in variables) {
          const payloadVars = variables as { slug?: string; payload: SubmissionPayload };
          payload = payloadVars.payload;
          if (payloadVars.slug) {
            targetSlug = payloadVars.slug;
          }
        } else {
          payload = variables as SubmissionPayload;
        }

        if (!targetSlug) {
          throw new Error("No question slug provided for submission");
        }

        const response = await apiClient.post(`/progress/questions/${targetSlug}/submit`, payload);
        return response.data?.data;
      },
      onMutate: async (variables) => {
        let targetSlug = defaultSlug;
        let isSolved = true;

        if (variables && typeof variables === "object" && "payload" in variables) {
          const payloadVars = variables as { slug?: string; payload: SubmissionPayload };
          if (payloadVars.slug) {
            targetSlug = payloadVars.slug;
          }
          isSolved = payloadVars.payload.status === "SOLVED";
        } else if (variables && typeof variables === "object" && "status" in variables) {
          const directPayload = variables as SubmissionPayload;
          isSolved = directPayload.status === "SOLVED";
        }

        if (!targetSlug) return { prevQuestions: [], prevCompanySnapshots: {} };

        // Cancel outgoing queries to prevent overwriting our optimistic state
        await queryClient.cancelQueries({ queryKey: ["questions"] });
        await queryClient.cancelQueries({ queryKey: ["company"] });

        // Snapshot previous states
        const prevQuestions = queryClient.getQueryData<QuestionSummary[]>(["questions"]);
        
        // Optimistically update global questions
        if (prevQuestions) {
          queryClient.setQueryData<QuestionSummary[]>(
            ["questions"],
            prevQuestions.map((q) =>
              q.slug === targetSlug
                ? { ...q, status: isSolved ? "SOLVED" : "UNATTEMPTED" }
                : q
            )
          );
        }

        // Optimistically update company detail lists
        const activeQueries = queryClient.getQueryCache().getAll();
        const companyQueries = activeQueries.filter((q) => q.queryKey[0] === "company");
        const prevCompanySnapshots: Record<string, CompanyDetail> = {};

        companyQueries.forEach((q) => {
          const key = q.queryKey;
          const data = queryClient.getQueryData<CompanyDetail>(key);
          if (data && data.questions) {
            prevCompanySnapshots[JSON.stringify(key)] = data;
            const hasQuestion = data.questions.some((ques: CompanyQuestionInfo) => ques.slug === targetSlug);
            if (hasQuestion) {
              const updatedQuestions = data.questions.map((ques: CompanyQuestionInfo) =>
                ques.slug === targetSlug ? { ...ques, solved: isSolved } : ques
              );
              const solvedCount = updatedQuestions.filter((ques: CompanyQuestionInfo) => ques.solved).length;
              const totalCount = updatedQuestions.length;
              const readinessPercentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

              queryClient.setQueryData<CompanyDetail>(key, {
                ...data,
                questions: updatedQuestions,
                readinessPercentage,
              });
            }
          }
        });

        return { prevQuestions, prevCompanySnapshots };
      },
      onError: (err, variables, context) => {
        // Rollback on failure
        if (context?.prevQuestions) {
          queryClient.setQueryData(["questions"], context.prevQuestions);
        }
        if (context?.prevCompanySnapshots) {
          Object.entries(context.prevCompanySnapshots).forEach(([keyStr, oldData]) => {
            queryClient.setQueryData(JSON.parse(keyStr), oldData);
          });
        }
      },
      onSettled: (_, __, variables) => {
        let targetSlug = defaultSlug;
        if (variables && typeof variables === "object" && "slug" in variables && variables.slug) {
          targetSlug = variables.slug;
        }

        queryClient.invalidateQueries({ queryKey: ["questions"] });
        if (targetSlug) {
          queryClient.invalidateQueries({ queryKey: ["question", targetSlug] });
        }
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["company"] });
        queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
        queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      },
    });

  // 5. Toggle bookmark mutation
  const useToggleBookmark = (slug: string) =>
    useMutation({
      mutationFn: async (qSlug?: string) => {
        const response = await apiClient.post(`/progress/questions/${qSlug || slug}/bookmark`);
        return response.data?.data;
      },
      onSuccess: (_, variables) => {
        const targetSlug = variables || slug;
        queryClient.invalidateQueries({ queryKey: ["question", targetSlug] });
        queryClient.invalidateQueries({ queryKey: ["company"] });
        queryClient.invalidateQueries({ queryKey: ["questions"] });
      },
    });

  // 6. Update study note mutation
  const useUpdateNote = (slug: string) =>
    useMutation({
      mutationFn: async (variables: string | { content: string; qSlug?: string }) => {
        const content = typeof variables === "string" ? variables : variables.content;
        const targetSlug = typeof variables === "string" ? slug : (variables.qSlug || slug);
        const response = await apiClient.post(`/progress/questions/${targetSlug}/notes`, { content });
        return response.data?.data;
      },
      onSuccess: (_, variables) => {
        const targetSlug = typeof variables === "string" ? slug : (variables.qSlug || slug);
        queryClient.invalidateQueries({ queryKey: ["question", targetSlug] });
        queryClient.invalidateQueries({ queryKey: ["company"] });
        queryClient.invalidateQueries({ queryKey: ["questions"] });
      },
    });

  return {
    useQuestionsList,
    useQuestionDetail,
    useQuestionEditorial,
    useSubmitAttempt,
    useToggleBookmark,
    useUpdateNote,
  };
}

