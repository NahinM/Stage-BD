import { supabase } from "../../config/database.js";

export const getHashedPassword = async (username) => {
    const { data, error } = await supabase
        .from("user")
        .select("password")
        .eq('username', `${username}`)
        .single();

    if (error) {
        console.error("Error fetching user details:", error);
        return null;
    }

    return data.password;
};

export const getUserDetail = async (username) => {
    const { data, error } = await supabase
        .from("user")
        .select("username,firstname,lastname,email,phone,birthYear,gender")
        .eq('username', `${username}`)
        .single();

    if (error) {
        console.error("Error fetching user details:", error);
        return null;
    }

    return data;
};