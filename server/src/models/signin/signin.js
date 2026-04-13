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
        .select(`
            id,
            username,
            email,
            firstname,
            lastname,
            phone,
            birthyear,
            gender,
            city,
            bio,
            is_verified
        `)
        .eq('username', `${username}`)
        .single();

    if (error) {
        console.error("Error fetching user details:", error);
        return null;
    }

    return data;
};

export const getUserRoles = async (userId) => {
    const { data, error } = await supabase
        .from("user_role")
        .select("role")
        .eq('user_id', `${userId}`);

    if (error) {
        console.error("Error fetching user roles:", error);
        return [];
    }
    if (data.length === 0) {
        return [];
    }
    return data.map(item => item.role);
};