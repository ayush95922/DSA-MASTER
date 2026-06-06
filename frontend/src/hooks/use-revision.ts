import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { RevisionSet, FlashcardDeck, Flashcard } from "@/types/revision";

export function useRevision() {
  const queryClient = useQueryClient();

  // 1. Fetch due questions & flashcards
  const useDueReviews = () =>
    useQuery<RevisionSet>({
      queryKey: ["revision", "due"],
      queryFn: async () => {
        const response = await apiClient.get("/revision/due");
        return response.data?.data;
      },
    });

  // 2. Fetch all flashcard decks
  const useDecks = () =>
    useQuery<FlashcardDeck[]>({
      queryKey: ["revision", "decks"],
      queryFn: async () => {
        const response = await apiClient.get("/revision/decks");
        return response.data?.data;
      },
    });

  // 3. Fetch cards by deck ID
  const useCards = (deckId: number | null) =>
    useQuery<Flashcard[]>({
      queryKey: ["revision", "deck-cards", deckId],
      queryFn: async () => {
        const response = await apiClient.get(`/revision/decks/${deckId}/cards`);
        return response.data?.data;
      },
      enabled: !!deckId,
    });

  // 4. Submit question review (SM-2 rating)
  const useSubmitQuestionReview = () =>
    useMutation({
      mutationFn: async ({ questionId, rating }: { questionId: number; rating: number }) => {
        await apiClient.post(`/revision/questions/${questionId}/review`, { rating });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["revision", "due"] });
        queryClient.invalidateQueries({ queryKey: ["analytics", "overview"] });
      },
    });

  // 5. Submit flashcard review (SM-2 rating)
  const useSubmitCardReview = () =>
    useMutation({
      mutationFn: async ({ cardId, rating }: { cardId: number; rating: number }) => {
        await apiClient.post(`/revision/cards/${cardId}/review`, { rating });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["revision", "due"] });
      },
    });

  // 6. Schedule a question manually
  const useScheduleQuestion = () =>
    useMutation({
      mutationFn: async (questionId: number) => {
        await apiClient.post(`/revision/questions/${questionId}/schedule`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["revision", "due"] });
      },
    });

  // 7. Sync daily revision session
  const useSyncSession = () =>
    useMutation({
      mutationFn: async ({ cardsReviewed, questionsReviewed }: { cardsReviewed: number; questionsReviewed: number }) => {
        await apiClient.post(`/revision/sync?cardsReviewed=${cardsReviewed}&questionsReviewed=${questionsReviewed}`);
      },
    });

  // 8. Generate AI Flashcards
  const useGenerateFlashcards = () =>
    useMutation({
      mutationFn: async (topic: string) => {
        const response = await apiClient.post(`/ai/revision/generate?topic=${encodeURIComponent(topic)}`);
        return response.data?.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["revision", "decks"] });
        queryClient.invalidateQueries({ queryKey: ["revision", "due"] });
      },
    });

  return {
    useDueReviews,
    useDecks,
    useCards,
    useSubmitQuestionReview,
    useSubmitCardReview,
    useScheduleQuestion,
    useSyncSession,
    useGenerateFlashcards,
  };
}
