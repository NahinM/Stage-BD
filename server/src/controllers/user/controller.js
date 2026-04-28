import { UserModel } from "../../models/user/user-model.js";
import { UserRoleModel } from "../../models/user/user-role-model.js";
import { verifyRefreshToken } from "../../middlewares/authentication/token.js";

export const UserController = {
  search: async (req, res) => {
    const info = req.query.info;
    if (!info) {
      return res.status(400).json({ message: "Search query is required" });
    }
    UserModel.search
      .find(info)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.error("Error searching for users: ", err);
        res.status(500).json({ message: "Error searching for users" });
      });
  },
  role: async (req, res) => {
    const userID = req.query.userID;
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }
    UserRoleModel.read(userID)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.error("Error retrieving user role: ", err);
        res.status(500).json({ message: "Error retrieving user role" });
      });
  },
  refresh: async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }
    const decoded = await verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    // Here you would typically generate a new access token
    res.status(200).json({ message: "Refresh token is valid", user: decoded });
  },
};
