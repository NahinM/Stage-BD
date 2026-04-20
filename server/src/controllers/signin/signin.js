import * as signInModel from "../../models/signin/signin.js";
import { verifyPassword } from "../../middlewares/authentication/hashpass.js";

const validate = async (username, password) => {
  const hashedPassword = await signInModel.getHashedPassword(username);
  if (!hashedPassword) {
    return { success: false, error: "Invalid username or password" };
  }

  let isMatch = await verifyPassword(`${password}`, `${hashedPassword}`);
  isMatch = isMatch || `${password}` === `${hashedPassword}`;
  if (!isMatch) {
    return { success: false, error: "Invalid password" };
  }

  return { success: true };
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;
  try {
    const validation = await validate(username, password);

    if (!validation.success) {
      return res.status(401).send({ message: validation.error, user: null });
    }

    const userDetail = await signInModel.getUserDetail(username);
    const userRoles = await signInModel.getUserRoles(userDetail.id);
    userDetail.roles = userRoles;
    return res.send({ message: "Sign-in successful!", user: userDetail });
  } catch (error) {
    console.error("Sign-in failed:", error);
    return res.status(500).send({ message: "Sign-in failed.", user: null });
  }
};
