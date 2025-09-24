// src/index.d.ts

export type Question = {
  id: string;
  question: string;           // Main question text
  choices: string[];          // Array of choices
  answer: string;             // Correct answer
  topic?: string;             // Optional topic/category
  createdAt?: string;         // ISO timestamp
  updatedAt?: string;         // ISO timestamp
};

// GraphQL input types
export type CreateQuestionInput = {
  question: string;
  choices: string[];
  answer: string;
  topic?: string;
};

export type DeleteQuestionInput = {
  id: string;
};

// GraphQL query responses
export type ListQuestionsResponse = {
  listQuestions: {
    items: Question[];
  };
};

export type GetQuestionResponse = {
  getQuestion: Question | null;
};

export type CreateQuestionResponse = {
  createQuestion: Question;
};

export type DeleteQuestionResponse = {
  deleteQuestion: Question;
};
