import { a } from "@aws-amplify/backend";

/**
 * Auth resource: Questions and Answers
 * Wrapped in a.resource() to provide ConstructFactory
 */
export const auth = a.resource({
  name: "auth",
  schema: a.schema({
    Question: a
      .model({
        id: a.id(),
        question: a.string().required(),
        choices: a.string().array().required(),
        answer: a.string(),
        topic: a.string(),
        createdAt: a.datetime().default(new Date().toISOString()),
        updatedAt: a.datetime().default(new Date().toISOString()),
      })
      .authorization((allow) => [
        allow.authenticated().to(["read"]),
        allow.group("admin").to(["create", "update", "delete"]),
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
        allow.authenticated().to(["create", "read"]),
        allow.group("admin").to(["read", "delete"]),
      ]),
  }),
});

export type AuthSchema = typeof auth;
