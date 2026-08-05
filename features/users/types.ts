export type UserPoints = {
  userId: string;
  points: number;
  pointsTimestamp: string | null;
};

export type UserPointsApiError = {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
  error?: string;
  message?: string;
};

