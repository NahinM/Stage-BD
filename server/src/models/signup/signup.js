import { supabase } from "../../config/database.js";

export const validateUserName = async (username) => {
    const { data, error } = await supabase
        .from("user")
        .select("username")
        .eq('username', `${username}`)
        .maybeSingle();

    if (error) {
        console.error("Error validating username:", error);
        return false;
    }

    if(data === null){
        return true;
    }

    return false;
}

export const validateEmail = async (email) => {
    const { data, error } = await supabase
        .from("user")
        .select("email")
        .eq('email', `${email}`)
        .maybeSingle();

    if (error) {
        console.error("Error validating email:", error);
        return false;
    }

    if(data === null){
        return true;
    }

    return false;
}

export const validatePhone = async (phone) => {
    const { data, error } = await supabase
        .from("user")
        .select("phone")
        .eq('phone', `${phone}`)
        .maybeSingle();

    if (error) {
        console.error("Error validating phone:", error);
        return false;
    }

    if(data === null){
        return true;
    }

    return false;
}

export const addUser = async ( firstName, lastName, username, password, email, phone, birthYear, gender) => {
    const { data, error } = await supabase
        .from("user")
        .insert([
            {
                firstname: firstName,
                lastname: lastName,
                username: username,
                password: password,
                email: email,
                phone: phone,
                birthYear: birthYear,
                gender: gender
            }
        ]);

    if (error) {
        console.error("Error adding user:", error);
        return false;
    }

    return true;
}

