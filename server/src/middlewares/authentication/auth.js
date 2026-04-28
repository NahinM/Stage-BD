import { verifyAccessToken } from "./token.js";

export const authorize = async (header) => {
  const authHeader = header.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1]; // Extract the token part
  return verifyAccessToken(token)
    .then((decoded) => {
      return decoded; // Return the decoded token if valid
    })
    .catch((err) => {
      console.error("Error verifying access token: ", err);
      return null; // Return null if token is invalid or expired
    });
};
