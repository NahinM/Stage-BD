import { authorize } from "../../middlewares/authentication/auth.js";
import { UserModel } from "../../models/user/user-model.js";
import { UserRoleModel } from "../../models/user/user-role-model.js";
import {
  verifyRefreshToken,
  generateAccessToken,
} from "../../middlewares/authentication/token.js";

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
  refreshAccessToken: async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }
    const decoded = await verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const userRoles = await UserRoleModel.read(decoded.id)
      .then((roles) => roles.map((r) => r.role))
      .catch((err) => {
        console.error("Error retrieving user roles: ", err);
        return null;
      });
    const payload = {
      id: decoded.id,
      username: decoded.username,
      roles: userRoles,
    };
    const accessToken = generateAccessToken(payload);
    res.status(200).json({
      message: "Refresh token is valid",
      user: decoded,
      roles: userRoles,
      accessToken: accessToken,
    });
    // Here you would typically generate a new access token
  },
  logout: async (req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  },
  get: async (req, res) => {
    const authResult = await authorize(req.headers);
    if (!authResult) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userID = authResult.id;
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }
    UserModel.read({ id: userID })
      .then((data) => {
        res.status(200).json(data[0]);
      })
      .catch((err) => {
        console.error("Error retrieving user: ", err);
        res.status(500).json({ message: "Error retrieving user" });
      });
  },
  update: async (req, res) => {
    console.log("Received request to update user with data:", req.body);
    const authResult = await authorize(req.headers);
    console.log("Authorization successful, auth result:", authResult);
    if (!authResult) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userID = authResult.id;
    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }
    console.log("Updating user with ID:", userID, "and data:", req.body);
    res
      .status(200)
      .json({
        message: "User update endpoint is working",
        userID,
        updateData: req.body,
      });
    // UserModel.update(userID, req.body)
    //   .then((data) => {
    //     console.log("User updated successfully:", data);
    //     res.status(200).json({ message: "User updated successfully", data });
    //   })
    //   .catch((err) => {
    //     console.error("Error updating user: ", err);
    //     res
    //       .status(500)
    //       .json({ message: "Error updating user", error: err.message });
    //   });
  },
};
