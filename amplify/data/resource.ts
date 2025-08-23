import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Post: a
    .model({
      content: a.string().required(),
      author: a.string().required(),
      authorImage: a.string(),
      reactions: a.integer().default(0),
      category: a.string(),
      reactionData: a.json(),
      type: a.string().default("post"),
      createdAt: a.datetime(),
    })
    .secondaryIndexes((index) => [
      index("type").sortKeys(["createdAt"])
    ])
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
  },
});
