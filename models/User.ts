import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Define the IUser interface
export interface IUser extends Document {
  password: string;
  email: string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: string | undefined;
  matchPassword(password: string): Promise<boolean>;
  getSignedToken(): string;
  getResetPasswordToken(): string;
}

// Define the UserSchema
const UserSchema: Schema = new Schema({
  password: {
    type: String,
    required: true,
    select: false,
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
  whishlists: {
    type: Array,
    default: [],
  },
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

// Add methods to the schema
UserSchema.methods.matchPassword = async function (
  password: string
): Promise<boolean> {
  // console.log("compae")
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function (): string {
  // const resetToken = crypto.randomBytes(20).toString("hex");
  // this.resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(resetToken)
  //   .digest("hex");
  // this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
  // return resetToken;
  return ""
};

// Define the User model with the correct types
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
