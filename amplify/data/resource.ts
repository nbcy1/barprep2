import { a } from "@aws-amplify/backend";

/**
 * Data resource placeholder
 */
export const data = a.schema({
  Example: a
    .model({
      id: a.id(),
      name: a.string().required(),
      createdAt: a.datetime().default(new Date().toISOString()),
      updatedAt: a.datetime().default(new Date().toISOString()),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.group("admin").to(["create", "update", "delete"]),
    ]),
});

export type DataSchema = typeof data;
