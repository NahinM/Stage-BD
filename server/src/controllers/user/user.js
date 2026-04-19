import { db_getUserByInfo } from "../../models/user/user.js"

export const getUserByInfo = async (req, res) => {
    const info = req.query.info;
    const users = await db_getUserByInfo(info);
    res.json(users);
}