import { sql } from "../../config/database.js";

export const EventVenueModel = {
  read: async (venueID) => {
    const res = await sql`select * from public."venue" where id = ${venueID}`;
    return res;
  },
  add: async (venue) => {
    const res = await sql`insert into public."venue" ${sql(venue)} returning *`;
    return res;
  },
  delete: async (venueID) => {
    const res =
      await sql`delete from public."venue" where id = ${venueID} returning *`;
    return res;
  },
  update: async (venueID, venue) => {
    const res =
      await sql`update public."venue" set ${sql(venue)} where id = ${venueID} returning *`;
    return res;
  },
};
