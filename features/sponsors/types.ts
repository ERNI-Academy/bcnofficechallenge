export type Sponsor = {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  curiosity: string | null;
};

export type SponsorApiError = {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
  error?: string;
  message?: string;
};

