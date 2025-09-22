// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const { Question } = initSchema(schema);

export {
  Question
};
