import { buildSchema, printSchema } from "graphql";

// Define your schema using buildSchema
const schema = buildSchema(`
 type User {
    id: ID!
    email: String!
    resetPasswordToken: String
    resetPasswordExpire: String
 }

 type Query {
    users: [User]
 }

 type Mutation {
    loginUser(email: String!, password: String!): String
    register(email: String!, password: String!): String
 }
`);

// Convert the schema object to an SDL string
const typeDefs = printSchema(schema);

export { typeDefs };
