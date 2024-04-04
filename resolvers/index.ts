// resolvers/index.ts
import { User } from "../models/User";

export const resolvers = {
  Query: {
    followByEmail: async (_, { email }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      return user.follow;
    },
  },
  Mutation: {
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
    register: async (_, { email, password }) => {
      // Your registration logic
    },
    addToFollow: async (_, { email, item }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      user.follow.push(item);
      await user.save();
      return "Item added to follow";
    },
    removeFromFollow: async (_, { email, item }) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        // Filter out the item from the follow if it exactly matches
        user.follow = user.follow.filter(
          (followItem) => followItem !== item
        );

        // Save the updated user
        await user.save();

        return "Item removed from follow successfully";
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
