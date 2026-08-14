export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
};

export type AuthenticatedSession = {
  user: LoggedUser;
  accessToken: string;
  expiresAt: string;
};

export type LoginErrorResponse = {
  error?: string;
};

export type ApiValidationErrorResponse = {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
  error?: string;
};

export type LoggedUser = {
  id: string;
  fullName: string;
  email: string;
  companyName: string | null;
  jobTitle: string | null;
  points: number;
  pointsTimestamp: string | null;
};

