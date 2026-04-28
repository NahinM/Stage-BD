import { verifyPassword } from "../../middlewares/authentication/hashpass.js";
import { UserModel } from "../../models/user/user-model.js";
import { generateRefreshToken } from "../../middlewares/authentication/token.js";

const validate = async (username, password) => {
  const hashedPassword = await UserModel.signIn.pass(username);
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
  console.log(`Attempting to sign in user: ${username}`);
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required" });
  }
  try {
    const validation = await validate(username, password);
    if (!validation.success) {
      console.warn(`Sign in failed for user ${username}: ${validation.error}`);
      return res.status(401).send({ message: validation.error });
    }
    const user = await UserModel.signIn.info(username);
    const refreshToken = generateRefreshToken({
      id: user.id,
      username: user.username,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log(`User ${username} signed in successfully`);
    res.send({ message: "Sign in successful" });
  } catch (error) {
    console.error("Error during sign in: ", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
