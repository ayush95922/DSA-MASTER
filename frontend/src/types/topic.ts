export interface TopicSummaryInfo {
  id: number;
  name: string;
  slug: string;
  description: string;
  totalQuestions: number;
  solvedQuestions: number;
}

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
  description: string;
  topics: TopicSummaryInfo[];
}

export interface TheorySectionInfo {
  title: string;
  content: string;
  order: number;
}

export interface TheoryInfo {
  overview: string;
  complexityAnalysis: string;
  sections: TheorySectionInfo[];
}

export interface SubtopicInfo {
  name: string;
  slug: string;
  description: string;
}

export interface TopicDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  theory: TheoryInfo | null;
  subtopics: SubtopicInfo[];
  questions?: TopicQuestionInfo[];
}

export interface ExternalLinkInfo {
  platformName: "LEETCODE" | "GEEKSFORGEEKS" | "HACKERRANK" | string;
  url: string;
}

export interface TopicQuestionInfo {
  id: number;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | string;
  points: number;
  premium: boolean;
  status: "SOLVED" | "ATTEMPTED" | "UNATTEMPTED" | string;
  externalLinks: ExternalLinkInfo[];
}
