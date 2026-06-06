export interface DailyGoalInfo {
  target: number;
  completed: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export interface ProgressSummaryInfo {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export interface HeatmapItem {
  date: string;
  count: number;
}

export interface RecommendedQuestionInfo {
  id: number;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  premium: boolean;
}

export interface DashboardData {
  dailyGoal: DailyGoalInfo;
  streak: StreakInfo;
  progressSummary: ProgressSummaryInfo;
  heatmap: HeatmapItem[];
  recommendedQuestions: RecommendedQuestionInfo[];
}
