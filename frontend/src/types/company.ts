export interface CompanySummary {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  tier: string;
  readinessPercentage: number;
  difficulty?: string;
  questionsCount?: number;
  mostAskedTopics?: string[];
}

export interface InterviewRoundInfo {
  name: string;
  focus: string;
  description: string;
}

export interface PrepWeekInfo {
  weekNumber: number;
  focusArea: string;
  description: string;
}

export interface FaqInfo {
  question: string;
  answer: string;
}

export interface InterviewExperienceInfo {
  title: string;
  rounds: string;
  questionsAsked: string[];
  difficulty: string;
  tips: string;
}

export interface CompanyRoadmapWeek {
  weekNumber: number;
  topics: string;
  focus: string;
}

export interface CompanyQuestionInfo {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  topic: string;
  pattern: string;
  frequency: string;
  leetcodeUrl: string | null;
  geeksforgeeksUrl: string | null;
  hackerrankUrl: string | null;
  youtubeUrl: string | null;
  solved: boolean;
  bookmarked: boolean;
  notes: string;
}

export interface CompanyDetail {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  tier: string;
  readinessPercentage: number;
  interviewRounds: InterviewRoundInfo[];
  preparationTimeline: PrepWeekInfo[];
  faqs: FaqInfo[];
  interviewExperiences: InterviewExperienceInfo[];
  topicWeightages: Record<string, number>;
  companyRoadmap: CompanyRoadmapWeek[];
  questions: CompanyQuestionInfo[];
}
