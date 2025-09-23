import { schema } from "./schema";

export * from "./schema";

// For Amplify DataStore / API v6
import { initSchema } from "@aws-amplify/datastore";

const { Question } = initSchema(schema);

export {
  Question
};

