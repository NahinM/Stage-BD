import { supabase } from "../../config/database";

export const validateUser = async (username, password) => {
    const {data,error} = await supabase.from("user").select("username,password").eq("username", username).single();
    if(error){
        console.error("Error fetching user details:", error);
        return null;
    }
    return data;
}

export const getUserDetail = async (username) => {
    const {data,error} = await supabase.from("user").select("username,firstname,lastname,email,phone,birthYear,gender").eq("username", username).single();
    if(error){
        console.error("Error fetching user details:", error);
        return null;
    }
    return data;
}