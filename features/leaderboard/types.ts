export type RankingItem = {
  id?: string | number;
  name: string;
  email: string;
  points: number;
  pointsTimestamp: string;
};

export type RankingApiError = {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
  error?: string;
  message?: string;
};

