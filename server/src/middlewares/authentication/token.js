import jwt from "jsonwebtoken";
import {
  jwtRefreshSecret,
  jwtAccessSecret,
} from "../../config/env-variables.js";

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, jwtRefreshSecret, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = async (token) => {
  return jwt.verify(token, jwtRefreshSecret, (err, decoded) => {
    if (err) {
      console.error("Error verifying refresh token: ", err);
      return null;
    }
    return decoded;
  });
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, roles: user.roles },
    jwtAccessSecret,
    {
      expiresIn: "12m",
    },
  );
};

export const verifyAccessToken = async (token) => {
  return jwt.verify(token, jwtAccessSecret, (err, decoded) => {
    if (err) {
      console.error("Error verifying access token: ", err);
      return null;
    }
    return decoded;
  });
};
