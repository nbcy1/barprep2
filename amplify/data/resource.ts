import { a } from "@aws-amplify/backend";

/**
 * Data resource placeholder
 * Wrapped in a.resource() to satisfy ConstructFactory type
 */
export const data = a.resource({
  name: "data",
  schema: a.schema({
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
  }),
});

export type DataSchema = typeof data;
