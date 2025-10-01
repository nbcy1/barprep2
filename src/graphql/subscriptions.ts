/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateQuestion = /* GraphQL */ `subscription OnCreateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
  onCreateQuestion(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateQuestionSubscriptionVariables,
  APITypes.OnCreateQuestionSubscription
>;
export const onUpdateQuestion = /* GraphQL */ `subscription OnUpdateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
  onUpdateQuestion(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateQuestionSubscriptionVariables,
  APITypes.OnUpdateQuestionSubscription
>;
export const onDeleteQuestion = /* GraphQL */ `subscription OnDeleteQuestion($filter: ModelSubscriptionQuestionFilterInput) {
  onDeleteQuestion(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteQuestionSubscriptionVariables,
  APITypes.OnDeleteQuestionSubscription
>;
export const onCreateQuizResult = /* GraphQL */ `subscription OnCreateQuizResult(
  $filter: ModelSubscriptionQuizResultFilterInput
  $owner: String
) {
  onCreateQuizResult(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateQuizResultSubscriptionVariables,
  APITypes.OnCreateQuizResultSubscription
>;
export const onUpdateQuizResult = /* GraphQL */ `subscription OnUpdateQuizResult(
  $filter: ModelSubscriptionQuizResultFilterInput
  $owner: String
) {
  onUpdateQuizResult(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateQuizResultSubscriptionVariables,
  APITypes.OnUpdateQuizResultSubscription
>;
export const onDeleteQuizResult = /* GraphQL */ `subscription OnDeleteQuizResult(
  $filter: ModelSubscriptionQuizResultFilterInput
  $owner: String
) {
  onDeleteQuizResult(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteQuizResultSubscriptionVariables,
  APITypes.OnDeleteQuizResultSubscription
>;
