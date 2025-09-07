// Minimal placeholder types — Amplify codegen will replace these with fuller generated types.
export type Question = {
  id?: string;
  category: string;
  text: string;
  options: string[];
  correctIndex?: number | null;
  explanation?: string | null;
};

export type AnswerAttemptInput = {
  userID: string;
  questionID?: string | null;
  selectedIndex: number;
  isCorrect?: boolean | null;
  category?: string | null;
  createdAt?: string | null;
};

export type ListQuestionsQuery = {
  listQuestions?: {
    items?: Question[] | null;
  } | null;
};
