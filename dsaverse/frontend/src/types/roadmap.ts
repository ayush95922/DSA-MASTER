export interface FlashcardInfo {
  front: string;
  back: string;
}

export interface ResourceLink {
  title: string;
  url: string;
}

export interface PracticeQuestionInfo {
  title: string;
  slug: string;
  difficulty: string;
  topic: string;
  leetcodeUrl: string | null;
  gfgUrl: string | null;
  hackerrankUrl: string | null;
  youtubeUrl: string | null;
}

export interface RoadmapSummary {
  id: number;
  title: string;
  slug: string;
  description: string;
  type: string;
  enrolled: boolean;
  enrollmentStatus: string | null;
  progressPercentage: number;
  totalNodes: number;
  completedNodes: number;
  difficulty: string;
  estimatedDuration: string;
  prerequisites: string;
  learningOutcomes: string[];
  completionCriteria: string;
}

export interface RoadmapNodeInfo {
  id: number;
  title: string;
  description: string;
  topicSlug: string | null;
  xCoordinate: number;
  yCoordinate: number;
  nodeOrder: number;
  completed: boolean;
  dependencyIds: number[];
  theoryPage: string | null;
  revisionNotes: string | null;
  cheatSheet: string | null;
  flashcards: FlashcardInfo[] | null;
  youtubeResources: ResourceLink[] | null;
  leetcodeProblems: ResourceLink[] | null;
  geeksforgeeksLinks: ResourceLink[] | null;
  practiceQuestions: PracticeQuestionInfo[] | null;
}

export interface RoadmapDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  type: string;
  enrolled: boolean;
  enrollmentStatus: string | null;
  progressPercentage: number;
  difficulty: string;
  estimatedDuration: string;
  prerequisites: string;
  learningOutcomes: string[];
  completionCriteria: string;
  nodes: RoadmapNodeInfo[];
}
