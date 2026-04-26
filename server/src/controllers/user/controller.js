import { UserModel } from "../../models/user/user-model.js";
import { UserRoleModel } from "../../models/user/user-role-model.js";

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
};
