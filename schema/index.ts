// schema.ts
import { buildSchema, printSchema } from "graphql";

/**
 * Defines the GraphQL schema for the application.
 * This schema describes the types, queries, and mutations available in the GraphQL API.
 */

// Define your schema using buildSchema
const schema = buildSchema(`
  type User {
    id: ID!
    email: String!
    follow: [String]
  }
  
  type EmailSubjectData {
    emails: [String]!
    subject: String!
  }

  type ApiKey {
    key: String!
  }


  type Query {
    users: [User]
    followByEmail(email: String!): [String]
    getEmailsAndSubject(email: String!): EmailSubjectData
    getApiKey: ApiKey  
  }

  type Mutation {
    loginUser(email: String!, password: String!): String
    register(email: String!, password: String!): String
    addToFollow(email: String!, item: String!): String
    removeFromFollow(email: String!, item: String!): String
    addMail(email: String!, emails: [String]!, subject: String!): String
  }
`);

// Convert the schema object to an SDL string
const typeDefs = printSchema(schema);

export { typeDefs };
