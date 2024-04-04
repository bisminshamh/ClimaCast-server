import { IUser, User } from "../models/User";
import  bcrypt from "bcrypt";

export const registerUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    console.log("Registering...");
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds of 10
    const user: IUser = await User.create({
      email,
      password: hashedPassword, // Store hashed password in the database
    });
    const token = user.getSignedToken();
    // Instead of using successResponse, return the token directly
    return token;
  } catch (error: any) {
    // Handle error appropriately, possibly by throwing an error or returning an error response
    throw new Error(error.message);
  }
};