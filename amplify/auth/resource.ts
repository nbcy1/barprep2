import { a } from "@aws-amplify/backend";

export const schema = a.schema({
  Question: a
    .model({
      id: a.id(),
      text: a.string().required(),            // the actual question
      choices: a.string().array().required(), // multiple choice options
      answer: a.string(),                     // correct answer (optional)
      createdAt: a.datetime().default(new Date().toISOString()), // fixed
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),                 // users can only read questions
      allow.group("admin").to(["create", "update", "delete"]), // admins manage questions
    ]),

  Answer: a
    .model({
      id: a.id(),
      questionId: a.id().required(),
      selected: a.string().required(),       // the user’s chosen answer
      userId: a.string().required(),         // who answered (map from signed-in user)
      createdAt: a.datetime().default(new Date().toISOString()), // fixed
    })
    .authorization((allow) => [
      allow.authenticated().to(["create", "read"]),      // users can submit + view their own answers
      allow.group("admin").to(["read", "delete"]),       // admins can review everything
    ]),
});

export type Schema = typeof schema;
