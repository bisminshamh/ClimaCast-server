import bcrypt from "bcrypt";
import { IUser, User } from "../models/User";

/**
 * Register a new user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<string>} The JWT token for the registered user.
 * @throws {Error} Throws an error if registration fails.
 */
export const registerUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds of 10

    // Create user in the database with hashed password
    const user: IUser = await User.create({
      email,
      password: hashedPassword, // Store hashed password in the database
    });

    // Generate JWT token for the registered user
    const token = user.getSignedToken();

    // Return the JWT token
    return token;
  } catch (error: any) {
    // Handle error appropriately, possibly by throwing an error or returning an error response
    throw new Error(error.message);
  }
};
