//resolvers/index.ts
import { User } from "../models/User";
import { registerUser, login } from "../controllers/auth";

// Define an interface for the user input
interface UserInput {
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    users: async () => {
      return await User.find().exec();
    },
  },
  Mutation: {
    loginUser: async (_, { email, password }, context) => {
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
    register: async (_, { email, password }, context) => {
      try {
        console.log("Register resolver function fired");
        const token = await registerUser({ email, password });
        console.log("token", token);
        return token;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    },
  },
};
