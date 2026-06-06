export interface QuestionSummary {
  id: number;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "SOLVED" | "ATTEMPTED" | "UNATTEMPTED";
  premium: boolean;
  points: number;
}

export interface HintInfo {
  number: number;
  content: string;
}

export interface QuestionDetail {
  id: number;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  description: string;
  inputFormat: string | null;
  outputFormat: string | null;
  constraints: string | null;
  premium: boolean;
  points: number;
  status: "SOLVED" | "ATTEMPTED" | "UNATTEMPTED";
  hints: HintInfo[];
}

export interface ApproachInfo {
  title: string;
  type: string; // BRUTE_FORCE, BETTER, OPTIMAL
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  javaCode: string | null;
  pythonCode: string | null;
  cppCode: string | null;
}

export interface EditorialDetail {
  overview: string;
  approaches: ApproachInfo[];
}
