import { sql } from "../../config/database.js";

export const UserRoleModel = {
  read: async (userID) => {
    const res =
      await sql`select * from public."user_role" where user_id = ${userID}`;
    return res;
  },
  add: async (userID, role) => {
    const res =
      await sql`insert into public."user_role" ${sql({ user_id: userID, role: role })} returning *`;
    return res;
  },
  delete: async (userID, role) => {
    const res =
      await sql`delete from public."user_role" where user_id = ${userID} and role = ${role} returning *`;
    return res;
  },
};
