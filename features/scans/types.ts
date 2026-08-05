export type ScanRecord = {
  sponsorId: string;
  scannedAt: string;
};

export type CreateScanPayload = {
  userId: string;
  qrId: string;
};

export type ScanApiError = {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
  error?: string;
  message?: string;
};

