import { a } from "@aws-amplify/backend";

/**
 * Auth resource: Questions and Answers
 * Matches your schema.graphql
 */
export const auth = a.schema({
  Question: a
    .model({
      id: a.id(),
      question: a.string().required(),          // matches GraphQL `question`
      choices: a.string().array().required(),   // multiple choice options
      answer: a.string(),                       // optional correct answer
      topic: a.string(),                        // optional topic
      createdAt: a.datetime().default(new Date().toISOString()), // AWSDateTime
      updatedAt: a.datetime().default(new Date().toISOString()), // AWSDateTime
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),                   // users can read
      allow.group("admin").to(["create", "update", "delete"]), // admins manage
    ]),

  Answer: a
    .model({
      id: a.id(),
      questionId: a.id().required(),
      selected: a.string().required(),
      userId: a.string().required(),
      createdAt: a.datetime().default(new Date().toISOString()),
      updatedAt: a.datetime().default(new Date().toISOString()),
    })
    .authorization((allow) => [
      allow.authenticated().to(["create", "read"]),  // users can submit/view their own answers
      allow.group("admin").to(["read", "delete"]),   // admins can review everything
    ]),
});

export type AuthSchema = typeof auth;
