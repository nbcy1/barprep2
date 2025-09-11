import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Question: a
    .model({
      question: a.string(),
      choices: a.json(), // store as JSON array
      answer: a.string(),
      topic: a.string(),
    })
    .authorization((allow) => [allow.guest()]), // open access for now
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
