import { supabase } from "../../config/database.js";

export const matchUserName = async (username) => {
  const { data, error } = await supabase
    .from("user")
    .select("username")
    .eq("username", `${username}`)
    .maybeSingle();

  if (error) {
    console.error("Error validating username:", error);
    return false;
  }

  if (data === null) {
    return true;
  }

  return false;
};

export const matchEmail = async (email) => {
  const { data, error } = await supabase
    .from("user")
    .select("email")
    .eq("email", `${email}`)
    .maybeSingle();

  if (error) {
    console.error("Error validating email:", error);
    return false;
  }

  if (data === null) {
    return true;
  }

  return false;
};

export const matchPhone = async (phone) => {
  const { data, error } = await supabase
    .from("user")
    .select("phone")
    .eq("phone", `${phone}`)
    .maybeSingle();

  if (error) {
    console.error("Error validating phone:", error);
    return false;
  }

  if (data === null) {
    return true;
  }

  return false;
};

export const addUser = async (userData) => {
  const { data, error } = await supabase.from("user").insert([userData]);

  if (error) {
    console.error("Error adding user:", error);
    return false;
  }

  return true;
};
