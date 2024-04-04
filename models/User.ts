import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the IUser interface
export interface IUser extends Document {
  password: string;
  email: string;
  matchPassword(password: string): Promise<boolean>;
  getSignedToken(): string;
  follow:Array<string>
}

// Define the UserSchema
const UserSchema: Schema = new Schema({
  password: {
    type: String,
    required: true,
    minlength: [8, "Please use minimum of 8 characters"],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Can't be blank"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please use a valid address"],
    unique: true,
    index: true,
  },
  follow: {
    type: Array,
    default: [],
  },
});

// Add methods to the schema
UserSchema.methods.matchPassword = async function (
  password: string,
  originalPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


// Define the User model with the correct types
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
