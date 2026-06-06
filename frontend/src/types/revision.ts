export interface DueQuestionInfo {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  repetitions: number;
  intervalDays: number;
}

export interface DueCardInfo {
  id: number;
  deckId: number;
  front: string;
  back: string;
  repetitions: number;
  intervalDays: number;
}

export interface RevisionSet {
  dueQuestionsCount: number;
  dueCardsCount: number;
  dueQuestions: DueQuestionInfo[];
  dueCards: DueCardInfo[];
}

export interface FlashcardDeck {
  id: number;
  title: string;
  description: string;
  cardCount: number;
}

export interface Flashcard {
  id: number;
  deckId: number;
  front: string;
  back: string;
}
