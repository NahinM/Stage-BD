import jwt from "jsonwebtoken";
import { jwtRefreshSecret } from "../../config/env-variables.js";

export const verifyRefreshToken = async (token) => {
  return jwt.verify(token, jwtRefreshSecret, (err, decoded) => {
    if (err) {
      console.error("Error verifying refresh token: ", err);
      return null;
    }
    return decoded;
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, jwtRefreshSecret, {
    expiresIn: "7d",
  });
};
