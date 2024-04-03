import jwt from "jsonwebtoken";

export const generateToken = (user: object) => {
  return jwt.sign({ id: user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
