import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { typeDefs } from "./schema"; // Ensure you export your schema as typeDefs
import { resolvers } from "./resolvers"; // Ensure you export your resolvers
console.log("test");
dotenv.config({ path: "./config/config.env" });

const app: Application = express(); // Explicitly type app as Application
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/default_db";

mongoose.set("strictQuery", false);
mongoose
  .connect(URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.log(err));

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Define your Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
// Start the Apollo Server instance
server.start().then(() => {
  // Apply the Apollo Server middleware to your Express app
  server.applyMiddleware({ app, path: "/graphql", cors: true });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to start Apollo Server', err);
});
