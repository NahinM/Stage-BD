import { sql } from "../../config/database.js";

const UserColumns = [
  "id",
  "username",
  "email",
  "firstname",
  "lastname",
  "phone",
  "birthyear",
  "gender",
  "city",
  "bio",
];

export const UserModel = {
  create: async (user) => {
    const res = await sql`insert into public."user" ${sql(user)} returning *`;
    return res;
  },
  read: async (prop = { columns: null, id: null }) => {
    const { columns, id } = prop;
    const COLUMNS = columns ? columns : UserColumns.join(", ");
    const query = `select ${COLUMNS} from public."user" ${id ? `where id = '${id}'` : ""}`;
    const res = await sql.unsafe(query);
    return res;
  },
  update: async (id, user) => {
    const res =
      await sql`update public."user" set ${sql(user)} where id = ${id} returning *`;
    return res;
  },
  delete: async (id) => {
    const res =
      await sql`delete from public."user" where id = ${id} returning *`;
    return res;
  },
  search: {
    username: async (value) => {
      const res =
        await sql`SELECT * FROM public."user" WHERE username ILIKE ${value}`;
      return res;
    },
    email: async (value) => {
      const res =
        await sql`SELECT * FROM public."user" WHERE email ILIKE ${value}`;
      return res;
    },
    phone: async (value) => {
      const res = await sql`SELECT * FROM public."user" WHERE phone = ${value}`;
      return res;
    },
    find: async (value) => {
      const res =
        await sql`SELECT id,username,firstname,lastname FROM public."user" WHERE username ILIKE ${`%${value}%`} OR firstname ILIKE ${`%${value}%`} OR lastname ILIKE ${`%${value}%`}`;
      return res;
    },
  },
};
