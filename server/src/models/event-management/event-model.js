import { sql } from "../../config/database.js";

export const EventModel = {
  create: async (event) => {
    const res = await sql`insert into public."event" ${sql(event)} returning *`;
    return res;
  },
  read: async (
    prop = {
      columns: null,
      id: null,
      search: { by: null, value: null },
      filter: { category_id: null, is_free: null, type: null, status: null },
    },
  ) => {
    const { columns, id, search, filter } = prop;
    const COLUMNS = columns ? columns : "*";
    if (id) {
      const res = await sql.unsafe(
        `select ${COLUMNS} from public."event" where id = '${id}'`,
      );
      return res;
    }
    const WHERE = [];
    if (search && search.value) {
      if (search.by === "title")
        WHERE.push(`title ILIKE '${`%${search.value}%`}'`);
      if (search.by === "organizer")
        WHERE.push(`organizer_id = '${search.value}'`);
    }
    if (filter) {
      if (filter.category_id) WHERE.push(`category_id = ${filter.category_id}`);
      if (filter.is_free) WHERE.push(`is_free = ${filter.is_free}`);
      if (filter.type) WHERE.push(`type = '${filter.type}'`);
      if (filter.status) WHERE.push(`status = '${filter.status}'`);
    }
    const query = `select ${COLUMNS} from public."event" ${WHERE.length > 0 ? `where ${WHERE.join(" AND ")}` : ""}`;
    const res = await sql.unsafe(query);
    return res;
  },
  update: async (id, event) => {
    const res =
      await sql`update public."event" set ${sql(event)} where id = ${id} returning *`;
    return res;
  },
  delete: async (id) => {
    const res =
      await sql`delete from public."event" where id = ${id} returning *`;
    return res;
  },
};
