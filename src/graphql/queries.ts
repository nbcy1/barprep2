/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getQuestion = /* GraphQL */ `query GetQuestion($id: ID!) {
  getQuestion(id: $id) {
    id
    question
    choices
    answer
    explanation
    topic
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetQuestionQueryVariables,
  APITypes.GetQuestionQuery
>;
export const listQuestions = /* GraphQL */ `query ListQuestions(
  $filter: ModelQuestionFilterInput
  $limit: Int
  $nextToken: String
) {
  listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      question
      choices
      answer
      explanation
      topic
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListQuestionsQueryVariables,
  APITypes.ListQuestionsQuery
>;
export const getQuizResult = /* GraphQL */ `query GetQuizResult($id: ID!) {
  getQuizResult(id: $id) {
    id
    userId
    topic
    totalQuestions
    correctAnswers
    score
    questionsAsked
    userAnswers
    completedAt
    owner
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetQuizResultQueryVariables,
  APITypes.GetQuizResultQuery
>;
export const listQuizResults = /* GraphQL */ `query ListQuizResults(
  $filter: ModelQuizResultFilterInput
  $limit: Int
  $nextToken: String
) {
  listQuizResults(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      topic
      totalQuestions
      correctAnswers
      score
      questionsAsked
      userAnswers
      completedAt
      owner
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListQuizResultsQueryVariables,
  APITypes.ListQuizResultsQuery
>;
export const quizResultsByUserId = /* GraphQL */ `query QuizResultsByUserId(
  $userId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelQuizResultFilterInput
  $limit: Int
  $nextToken: String
) {
  quizResultsByUserId(
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      topic
      totalQuestions
      correctAnswers
      score
      questionsAsked
      userAnswers
      completedAt
      owner
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.QuizResultsByUserIdQueryVariables,
  APITypes.QuizResultsByUserIdQuery
>;
