/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateQuestionInput = {
  id?: string | null,
  question: string,
  choices: Array< string >,
  answer: string,
  explanation?: string | null,
  topic?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelQuestionConditionInput = {
  question?: ModelStringInput | null,
  choices?: ModelStringInput | null,
  answer?: ModelStringInput | null,
  explanation?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelQuestionConditionInput | null > | null,
  or?: Array< ModelQuestionConditionInput | null > | null,
  not?: ModelQuestionConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Question = {
  __typename: "Question",
  id: string,
  question: string,
  choices: Array< string >,
  answer: string,
  explanation?: string | null,
  topic?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateQuestionInput = {
  id: string,
  question?: string | null,
  choices?: Array< string > | null,
  answer?: string | null,
  explanation?: string | null,
  topic?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteQuestionInput = {
  id: string,
};

export type CreateQuizResultInput = {
  id?: string | null,
  userId: string,
  topic: string,
  totalQuestions: number,
  correctAnswers: number,
  score: number,
  questionsAsked?: Array< string | null > | null,
  userAnswers?: string | null,
  completedAt: string,
  owner?: string | null,
};

export type ModelQuizResultConditionInput = {
  userId?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  totalQuestions?: ModelIntInput | null,
  correctAnswers?: ModelIntInput | null,
  score?: ModelFloatInput | null,
  questionsAsked?: ModelStringInput | null,
  userAnswers?: ModelStringInput | null,
  completedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelQuizResultConditionInput | null > | null,
  or?: Array< ModelQuizResultConditionInput | null > | null,
  not?: ModelQuizResultConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type QuizResult = {
  __typename: "QuizResult",
  id: string,
  userId: string,
  topic: string,
  totalQuestions: number,
  correctAnswers: number,
  score: number,
  questionsAsked?: Array< string | null > | null,
  userAnswers?: string | null,
  completedAt: string,
  owner?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateQuizResultInput = {
  id: string,
  userId?: string | null,
  topic?: string | null,
  totalQuestions?: number | null,
  correctAnswers?: number | null,
  score?: number | null,
  questionsAsked?: Array< string | null > | null,
  userAnswers?: string | null,
  completedAt?: string | null,
  owner?: string | null,
};

export type DeleteQuizResultInput = {
  id: string,
};

export type ModelQuestionFilterInput = {
  id?: ModelIDInput | null,
  question?: ModelStringInput | null,
  choices?: ModelStringInput | null,
  answer?: ModelStringInput | null,
  explanation?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelQuestionFilterInput | null > | null,
  or?: Array< ModelQuestionFilterInput | null > | null,
  not?: ModelQuestionFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelQuestionConnection = {
  __typename: "ModelQuestionConnection",
  items:  Array<Question | null >,
  nextToken?: string | null,
};

export type ModelQuizResultFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  totalQuestions?: ModelIntInput | null,
  correctAnswers?: ModelIntInput | null,
  score?: ModelFloatInput | null,
  questionsAsked?: ModelStringInput | null,
  userAnswers?: ModelStringInput | null,
  completedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelQuizResultFilterInput | null > | null,
  or?: Array< ModelQuizResultFilterInput | null > | null,
  not?: ModelQuizResultFilterInput | null,
};

export type ModelQuizResultConnection = {
  __typename: "ModelQuizResultConnection",
  items:  Array<QuizResult | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSubscriptionQuestionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  question?: ModelSubscriptionStringInput | null,
  choices?: ModelSubscriptionStringInput | null,
  answer?: ModelSubscriptionStringInput | null,
  explanation?: ModelSubscriptionStringInput | null,
  topic?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionQuestionFilterInput | null > | null,
  or?: Array< ModelSubscriptionQuestionFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionQuizResultFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionStringInput | null,
  topic?: ModelSubscriptionStringInput | null,
  totalQuestions?: ModelSubscriptionIntInput | null,
  correctAnswers?: ModelSubscriptionIntInput | null,
  score?: ModelSubscriptionFloatInput | null,
  questionsAsked?: ModelSubscriptionStringInput | null,
  userAnswers?: ModelSubscriptionStringInput | null,
  completedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionQuizResultFilterInput | null > | null,
  or?: Array< ModelSubscriptionQuizResultFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type CreateQuestionMutationVariables = {
  input: CreateQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type CreateQuestionMutation = {
  createQuestion?:  {
    __typename: "Question",
    id: string,
    question: string,
    choices: Array< string >,
    answer: string,
    explanation?: string | null,
    topic?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateQuestionMutationVariables = {
  input: UpdateQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type UpdateQuestionMutation = {
  updateQuestion?:  {
    __typename: "Question",
    id: string,
    question: string,
    choices: Array< string >,
    answer: string,
    explanation?: string | null,
    topic?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteQuestionMutationVariables = {
  input: DeleteQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type DeleteQuestionMutation = {
  deleteQuestion?:  {
    __typename: "Question",
    id: string,
    question: string,
    choices: Array< string >,
    answer: string,
    explanation?: string | null,
    topic?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateQuizResultMutationVariables = {
  input: CreateQuizResultInput,
  condition?: ModelQuizResultConditionInput | null,
};

export type CreateQuizResultMutation = {
  createQuizResult?:  {
    __typename: "QuizResult",
    id: string,
    userId: string,
    topic: string,
    totalQuestions: number,
    correctAnswers: number,
    score: number,
    questionsAsked?: Array< string | null > | null,
    userAnswers?: string | null,
    completedAt: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateQuizResultMutationVariables = {
  input: UpdateQuizResultInput,
  condition?: ModelQuizResultConditionInput | null,
};

export type UpdateQuizResultMutation = {
  updateQuizResult?:  {
    __typename: "QuizResult",
    id: string,
    userId: string,
    topic: string,
    totalQuestions: number,
    correctAnswers: number,
    score: number,
    questionsAsked?: Array< string | null > | null,
    userAnswers?: string | null,
    completedAt: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteQuizResultMutationVariables = {
  input: DeleteQuizResultInput,
  condition?: ModelQuizResultConditionInput | null,
};

export type DeleteQuizResultMutation = {
  deleteQuizResult?:  {
    __typename: "QuizResult",
    id: string,
    userId: string,
    topic: string,
    totalQuestions: number,
    correctAnswers: number,
    score: number,
    questionsAsked?: Array< string | null > | null,
    userAnswers?: string | null,
    completedAt: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetQuestionQueryVariables = {
  id: string,
};

export type GetQuestionQuery = {
  getQuestion?:  {
    __typename: "Question",
    id: string,
    question: string,
    choices: Array< string >,
    answer: string,
    explanation?: string | null,
    topic?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListQuestionsQueryVariables = {
  filter?: ModelQuestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListQuestionsQuery = {
  listQuestions?:  {
    __typename: "ModelQuestionConnection",
    items:  Array< {
      __typename: "Question",
      id: string,
      question: string,
      choices: Array< string >,
      answer: string,
      explanation?: string | null,
      topic?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetQuizResultQueryVariables = {
  id: string,
};

export type GetQuizResultQuery = {
  getQuizResult?:  {
    __typename: "QuizResult",
    id: string,
    userId: string,
    topic: string,
    totalQuestions: number,
    correctAnswers: number,
    score: number,
    questionsAsked?: Array< string | null > | null,
    userAnswers?: string | null,
    completedAt: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListQuizResultsQueryVariables = {
  filter?: ModelQuizResultFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListQuizResultsQuery = {
  listQuizResults?:  {
    __typename: "ModelQuizResultConnection",
    items:  Array< {
      __typename: "QuizResult",
      id: string,
      userId: string,
      topic: string,
      totalQuestions: number,
      correctAnswers: number,
      score: number,
      questionsAsked?: Array< string | null > | null,
      userAnswers?: string | null,
      completedAt: string,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type QuizResultsByUserIdQueryVariables = {
  userId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelQuizResultFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type QuizResultsByUserIdQuery = {
  quizResultsByUserId?:  {
    __typename: "ModelQuizResultConnection",
    items:  Array< {
      __typename: "QuizResult",
      id: string,
      userId: string,
      topic: string,
      totalQuestions: number,
      correctAnswers: number,
      score: number,
      questionsAsked?: Array< string | null > | null,
      userAnswers?: string | null,
      completedAt: string,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateQuestionSubscriptionVariables = {
  filter?: ModelSubscriptionQuestionFilterInput | null,
};

export type OnCreateQuestionSubscription = {
  onCreateQuestion?:  {
    __typename: "Question",
    id: string,
    question: string,
    choices: Array< string >,
    answer: string,
    explanation?: string | null,
    topic?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateQuestionSubscriptionVariables = {
  filter?: ModelSubscriptionQuestionFilterInput | null,
};

export type OnUpdateQuestionSubscription = {
  onUpdateQuestion?:  {
    __typename: "Question",
    id: string,
    question: string,
    choices: Array< string >,
    answer: string,
    explanation?: string | null,
    topic?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteQuestionSubscriptionVariables = {
  filter?: ModelSubscriptionQuestionFilterInput | null,
};

export type OnDeleteQuestionSubscription = {
  onDeleteQuestion?:  {
    __typename: "Question",
    id: string,
    question: string,
    choices: Array< string >,
    answer: string,
    explanation?: string | null,
    topic?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateQuizResultSubscriptionVariables = {
  filter?: ModelSubscriptionQuizResultFilterInput | null,
  owner?: string | null,
};

export type OnCreateQuizResultSubscription = {
  onCreateQuizResult?:  {
    __typename: "QuizResult",
    id: string,
    userId: string,
    topic: string,
    totalQuestions: number,
    correctAnswers: number,
    score: number,
    questionsAsked?: Array< string | null > | null,
    userAnswers?: string | null,
    completedAt: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateQuizResultSubscriptionVariables = {
  filter?: ModelSubscriptionQuizResultFilterInput | null,
  owner?: string | null,
};

export type OnUpdateQuizResultSubscription = {
  onUpdateQuizResult?:  {
    __typename: "QuizResult",
    id: string,
    userId: string,
    topic: string,
    totalQuestions: number,
    correctAnswers: number,
    score: number,
    questionsAsked?: Array< string | null > | null,
    userAnswers?: string | null,
    completedAt: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteQuizResultSubscriptionVariables = {
  filter?: ModelSubscriptionQuizResultFilterInput | null,
  owner?: string | null,
};

export type OnDeleteQuizResultSubscription = {
  onDeleteQuizResult?:  {
    __typename: "QuizResult",
    id: string,
    userId: string,
    topic: string,
    totalQuestions: number,
    correctAnswers: number,
    score: number,
    questionsAsked?: Array< string | null > | null,
    userAnswers?: string | null,
    completedAt: string,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
