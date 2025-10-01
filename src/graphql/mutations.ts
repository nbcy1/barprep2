/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createQuestion = /* GraphQL */ `mutation CreateQuestion(
  $input: CreateQuestionInput!
  $condition: ModelQuestionConditionInput
) {
  createQuestion(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateQuestionMutationVariables,
  APITypes.CreateQuestionMutation
>;
export const updateQuestion = /* GraphQL */ `mutation UpdateQuestion(
  $input: UpdateQuestionInput!
  $condition: ModelQuestionConditionInput
) {
  updateQuestion(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateQuestionMutationVariables,
  APITypes.UpdateQuestionMutation
>;
export const deleteQuestion = /* GraphQL */ `mutation DeleteQuestion(
  $input: DeleteQuestionInput!
  $condition: ModelQuestionConditionInput
) {
  deleteQuestion(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteQuestionMutationVariables,
  APITypes.DeleteQuestionMutation
>;
export const createQuizResult = /* GraphQL */ `mutation CreateQuizResult(
  $input: CreateQuizResultInput!
  $condition: ModelQuizResultConditionInput
) {
  createQuizResult(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateQuizResultMutationVariables,
  APITypes.CreateQuizResultMutation
>;
export const updateQuizResult = /* GraphQL */ `mutation UpdateQuizResult(
  $input: UpdateQuizResultInput!
  $condition: ModelQuizResultConditionInput
) {
  updateQuizResult(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateQuizResultMutationVariables,
  APITypes.UpdateQuizResultMutation
>;
export const deleteQuizResult = /* GraphQL */ `mutation DeleteQuizResult(
  $input: DeleteQuizResultInput!
  $condition: ModelQuizResultConditionInput
) {
  deleteQuizResult(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteQuizResultMutationVariables,
  APITypes.DeleteQuizResultMutation
>;
