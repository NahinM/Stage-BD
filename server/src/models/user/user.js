import { supabase } from "../../config/database.js"

export const db_getUserByInfo = async (info) => {
    const { data, error } = await supabase
        .from("user")
        .select("id,username,firstname,lastname")
        .or(`username.ilike.%${info}%,firstname.ilike.%${info}%,lastname.ilike.%${info}%`)

    if (error) {
        throw new Error(error.message);
    }

    return data;

}