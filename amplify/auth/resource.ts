import { a } from "@aws-amplify/backend";

/**
 * Export as `auth` so `backend.ts` can import it
 */
export const auth = a.schema({
  Question: a
    .model({
      id: a.id(),
      text: a.string().required(),             // your question text
      choices: a.string().array().required(),  // multiple choice options
      answer: a.string(),                      // correct answer (optional)
      topic: a.string(),                       // added topic field to match schema.graphql
      createdAt: a.datetime().default(new Date().toISOString()),
      updatedAt: a.datetime().default(new Date().toISOString()),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),                 // users can only read questions
      allow.group("admin").to(["create", "update", "delete"]), // admins manage questions
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
});

export type AuthSchema = typeof auth;
