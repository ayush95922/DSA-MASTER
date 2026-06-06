export interface PerformanceSnapshot {
  date: string;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSolved: number;
}

export interface WeakTopicInfo {
  topicName: string;
  slug: string;
  totalQuestions: number;
  solvedQuestions: number;
  accuracy: number;
}

export interface AnalyticsOverview {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  accuracyRate: number;
  history: PerformanceSnapshot[];
  weakTopics: WeakTopicInfo[];
}
