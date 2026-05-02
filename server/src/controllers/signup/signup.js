import { getHashedPassword } from "../../middlewares/authentication/hashpass.js";
import { UserModel } from "../../models/user/user-model.js";

const validate = async (username, email, phone) => {
  let usernameValid = await UserModel.search.username(username);
  console.log("Username validation result:", usernameValid);
  if (usernameValid.length > 0) {
    return { success: false, error: "Username already exists" };
  }
  let emailValid = await UserModel.search.email(email);
  console.log("Email validation result:", emailValid);
  if (emailValid.length > 0) {
    return { success: false, error: "Email already exists" };
  }
  let phoneValid = await UserModel.search.phone(phone);
  console.log("Phone validation result:", phoneValid);
  if (phoneValid.length > 0) {
    return { success: false, error: "Phone number already exists" };
  }
  return { success: true };
};

export const signUp = async (req, res) => {
  try {
    const userData = req.body || {};
    const { username, email, phone, password } = userData;

    const validation = await validate(username, email, phone);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const hashedPassword = await getHashedPassword(password);
    if (!hashedPassword) {
      console.error("Password hashing failed");
      return res.status(500).json({ error: "Failed to hash password" });
    }
    userData.password = hashedPassword;

    const createdUser = await UserModel.create(userData);
    const isEmptyObject =
      createdUser &&
      typeof createdUser === "object" &&
      !Array.isArray(createdUser) &&
      Object.keys(createdUser).length === 0;
    if (
      !createdUser ||
      (Array.isArray(createdUser) && createdUser.length === 0) ||
      isEmptyObject
    ) {
      console.error("User creation failed", createdUser);
      return res.status(500).json({ error: "Failed to create user" });
    }

    return res
      .status(201)
      .json({ message: "Sign-up successful!", user: createdUser });
  } catch (err) {
    console.error("signUp error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
