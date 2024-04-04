import { Response } from "express";

export const successResponse = (token: string, res: Response) => {
  res.status(200).json({
    success: true,
    token,
  });
};

export const errorResponse = (
  message: string,
  statusCode: number,
  res: Response
) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
