import { sql } from "../../config/database.js";

export const EventCategoryModel = {
  read: async () => {
    const res = await sql`select * from public."event_category"`;
    return res;
  },
  add: async (category) => {
    const res =
      await sql`insert into public."event_category" ${sql(category)} returning *`;
    return res;
  },
  delete: async (id) => {
    const res =
      await sql`delete from public."event_category" where id = ${id} returning *`;
    return res;
  },
};
