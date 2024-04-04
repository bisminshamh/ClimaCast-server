// schema.ts
import { buildSchema, printSchema } from "graphql";

// Define your schema using buildSchema
const schema = buildSchema(`
  type User {
    id: ID!
    email: String!
    follow: [String]
  }

  type Query {
    users: [User]
    followByEmail(email: String!): [String]
  }

  type Mutation {
    loginUser(email: String!, password: String!): String
    register(email: String!, password: String!): String
    addToFollow(email: String!, item: String!): String
    removeFromFollow(email: String!, item: String!): String
  }
`);

// Convert the schema object to an SDL string
const typeDefs = printSchema(schema);

export { typeDefs };