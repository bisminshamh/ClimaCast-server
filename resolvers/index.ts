// resolvers/index.ts
import { registerUser } from "../controllers/auth";
import { User } from "../models/User";
import { fetchWeatherDataByCityNames } from "../utils/weatherData";

/**
 * Resolvers for handling GraphQL queries and mutations related to user authentication, follow functionality, and email settings.
 */
export const resolvers = {
  Query: {
    /**
     * Retrieves the list of followed items (locations) for a given user by their email.
     * @param {*} _ Unused root object
     * @param {{ email: string }} args Arguments containing the user's email
     * @returns {Promise<string[]>} A list of followed items
     * @throws {Error} If user not found
     */
    followByEmail: async (_, { email }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      return user.follow;
    },
    /**
     * Retrieves the email addresses and subject for sending weather updates for a given user by their email.
     * @param {*} _ Unused root object
     * @param {{ email: string }} args Arguments containing the user's email
     * @returns {Promise<{ emails: string[], subject: string }>} Email addresses and subject
     * @throws {Error} If user not found
     */
    getEmailsAndSubject: async (_, { email }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      return { emails: user.emails, subject: user.subject };
    },
    /**
     * Retrieves the API key from the environment.
     * @returns {ApiKey} API key
     */
    getApiKey: () => {
      // Retrieve the API key from the environment
      const apiKey = process.env.API_KEY;
      console.log(process.env.API_KEY);
      // Return the API key as part of the response
      return { key: apiKey };
    },
  },
  Mutation: {
    /**
     * Authenticates a user by email and password and returns a signed JWT token upon successful login.
     * @param {*} _ Unused root object
     * @param {{ email: string, password: string }} args Arguments containing the user's email and password
     * @returns {Promise<string>} Signed JWT token
     * @throws {Error} If user not found or invalid credentials
     */
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }
      return user.getSignedToken();
    },
    /**
     * Registers a new user with the provided email and password.
     * @param {*} _ Unused root object
     * @param {{ email: string, password: string }} args Arguments containing the user's email and password
     * @returns {Promise<string>} Signed JWT token
     * @throws {Error} If registration fails or an unknown error occurs
     */
    register: async (_, { email, password }, context) => {
      try {
        const token = await registerUser({ email, password });
        return token;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    },
    /**
     * Adds an item to the list of followed items for a user by email.
     * @param {*} _ Unused root object
     * @param {{ email: string, item: string }} args Arguments containing the user's email and item to add
     * @returns {Promise<string>} Success message
     * @throws {Error} If user not found
     */
    addToFollow: async (_, { email, item }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      user.follow.push(item);
      await user.save();
      return "Item added to follow";
    },
    /**
     * Removes an item from the list of followed items for a user by email.
     * @param {*} _ Unused root object
     * @param {{ email: string, item: string }} args Arguments containing the user's email and item to remove
     * @returns {Promise<string>} Success message
     * @throws {Error} If user not found
     */
    removeFromFollow: async (_, { email, item }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        user.follow = user.follow.filter((followItem) => followItem !== item);
        await user.save();
        return "Item removed from follow successfully";
      } catch (error) {
        throw new Error(error.message);
      }
    },
    /**
     * Updates the email addresses and subject for sending weather updates for a user by email.
     * @param {*} _ Unused root object
     * @param {{ email: string, emails: string[], subject: string }} args Arguments containing the user's email, new email addresses, and subject
     * @returns {Promise<string>} Success message
     * @throws {Error} If user not found
     */
    addMail: async (_, { email, emails, subject }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        user.emails = emails;
        user.subject = subject;
        await user.save();
        return "Mail details added successfully";
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
