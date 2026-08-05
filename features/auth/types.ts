export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  jobTitle: string;
  linkedIn?: string;
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
};

export type LoggedUser = {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  companyName: string;
  jobTitle: string;
  points: number;
  pointsTimestamp: string;
  linkedIn: string;
};

