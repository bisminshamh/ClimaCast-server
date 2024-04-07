import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Interface representing a user document.
 * @interface
 * @extends Document
 */
export interface IUser extends Document {
  password: string;
  email: string;
  matchPassword(password: string): Promise<boolean>;
  getSignedToken(): string;
  follow: Array<string>;
  emails: string[];
  subject: string;
}

/**
 * Mongoose schema for the User model.
 * @constant
 */
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
  emails: {
    type: [String],
    default: [],
  },
  subject: {
    type: String,
    default: "Weather Update",
  },
});

/**
 * Method to compare a plain text password with the hashed password stored in the database.
 * @memberof IUser
 * @function
 * @name matchPassword
 * @param {string} password - The plain text password to compare.
 * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the passwords match.
 */
UserSchema.methods.matchPassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

/**
 * Method to generate a signed JWT token for the user.
 * @memberof IUser
 * @function
 * @name getSignedToken
 * @returns {string} The signed JWT token.
 */
UserSchema.methods.getSignedToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * Mongoose model for the User.
 * @constant
 * @type {Model<IUser>}
 */
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
