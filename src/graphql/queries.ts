// Minimal placeholder GraphQL query for listing questions.
// After you `amplify push` and run `amplify codegen`, replace this with generated queries
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