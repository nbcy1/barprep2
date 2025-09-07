export const createAnswerAttempt = /* GraphQL */ `
  mutation CreateAnswerAttempt($input: CreateAnswerAttemptInput!) {
    createAnswerAttempt(input: $input) {
      id
      userID
      questionID
      selectedIndex
      isCorrect
      category
      createdAt
    }
  }
`
