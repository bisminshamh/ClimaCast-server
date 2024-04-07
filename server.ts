import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import path from "path"; // Import the path module
import dotenv from "dotenv";
import mongoose from "mongoose";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { scheduleWeatherUpdateEmails } from "./controllers/weather"; // Import the function from weather controller

dotenv.config({ path: "./config/config.env" });
/**
 * Express application instance.
 * @type {Application}
 */
const app: Application = express();

/**
 * The port on which the server is running.
 * @type {number|string}
 */
const PORT = process.env.PORT || 5000;

/**
 * The MongoDB URI.
 * @type {string}
 */
const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/default_db";

/**
 * Configure MongoDB connection.
 */
mongoose.set("strictQuery", false);

/**
 * Connect to MongoDB.
 */
mongoose
  .connect(URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err: any) => console.log(err));

/**
 * Middleware to log incoming requests.
 */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, "../../ClimaCast-ui/dist")));

// Middleware to serve the main HTML file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../ClimaCast-ui/dist", "index.html"));
});


/**
 * Create ApolloServer instance.
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


/**
 * Start the ApolloServer and Express application.
 */
server
  .start()
  .then(() => {
    server.applyMiddleware({ app, path: "/graphql", cors: true });

    // Call the function to schedule weather update emails
    scheduleWeatherUpdateEmails();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start Apollo Server", err);
  });
