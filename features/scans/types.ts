export type QrPayload = {
  v: 1;
  token: string;
};

export type ScanRecord = {
  sponsorId: string;
  completedAt: string;
  pointsAwarded: number;
  maximumPoints: number;
  answerResults: QuizAnswerResult[];
};

export type QuizAnswerResult = {
  questionId: string;
  questionText: string;
  isCorrect: boolean;
};

export type PreparedQuestion = {
  id: string;
  text: string;
  options: PreparedOption[];
};

export type PreparedOption = {
  id: string;
  text: string;
};

export type PreparedQuiz = {
  roomId: string;
  roomName: string;
  question: PreparedQuestion;
};

export type PrepareQuizPayload = {
  roomId: string;
  qr: QrPayload;
};

export type CompleteQuizPayload = PrepareQuizPayload & {
  questionId: string;
  selectedOptionIds: string[];
};

export type QuizResult = {
  pointsEarned: number;
  maximumPoints: number;
  totalPoints: number;
  completedAt: string;
  answerResults: QuizAnswerResult[];
};

export type ScanApiError = {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
  errorCode?: string;
  error?: string;
  message?: string;
};
