// src/graphql/queries.ts

// Query for questions
export const listQuestions = /* GraphQL */ `
  query ListQuestions {
    listQuestions {
      items {
        id
        category
        text
        options
        explanation
        correctIndex
      }
    }
  }
`

// Query for answer attempts (needed by History.tsx)
export const listAnswerAttempts = /* GraphQL */ `
  query ListAnswerAttempts($filter: ModelAnswerAttemptFilterInput) {
    listAnswerAttempts(filter: $filter) {
      items {
        id
        questionID
        category
        selectedIndex
        isCorrect
        createdAt
      }
    }
  }
`
