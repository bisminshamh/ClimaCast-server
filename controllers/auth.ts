import { Response, Request } from "express";
import { IUser, User } from "../models/User";
import { ErrorResponse } from "../utils/errorResponse";
import sendEmail from "../utils/emailSender";
import * as crypto from "crypto";
import { sendResponse } from "../utils/sendResponse";
import { generateToken } from "../utils/generateToken";

exports.register = async (req: Request, res: Response, next: any) => {
  const { username, email, password } = req.body;
  try {
    const user: IUser = await User.create({
      username,
      email,
      password,
    });
    const token = await generateToken(user);
    sendResponse(token, res);

  } catch (error: any) {
    next(error);
  }
};

exports.login = async (req: Request, res: Response, next: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide a valid email and Password", 400)
    );
  }
  try {
    const user: IUser | null = await User.findOne({ email }).select(
      "+password"
    );
    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    const isMatch: boolean = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    const token = await generateToken(user);

    sendResponse(token, res);
  } catch (error: any) {
    return next(new ErrorResponse(error.message, 500));
  }
};

exports.forgotPassword = async (req: Request, res: Response, next: any) => {
  const { email } = req.body;

  try {
    const user: IUser | null = await User.findOne({ user: email });
    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
    const message = `
            <h1> You have requested a password reset </h1>
            <p> Please go to this link to reset your password </p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a> 
            `;
    try {
      await sendEmail({
        to: user.email,
        text: message,
        subject: message,
      });
      res.status(200).json({
        success: true,
        data: "Email Sent",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req: Request, res: Response, next: any) => {
  const { password } = req.body;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user: IUser | null = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(201).json({
      success: true,
      data: "Password Reset successful",
    });
  } catch (error) {
    next(error);
  }
};