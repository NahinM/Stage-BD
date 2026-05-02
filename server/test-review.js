import { supabase } from "./src/config/database.js";

async function test() {
    const { data: data1, error: err1 } = await supabase.from('users').select('id').limit(1);
    console.log("users table:", err1 ? err1.message : "exists");
    
    const { data: data2, error: err2 } = await supabase.from('user').select('id').limit(1);
    console.log("user table:", err2 ? err2.message : "exists");
    
    const { data: data3, error: err3 } = await supabase.from('Adittya').select('id').limit(1);
    console.log("Adittya table:", err3 ? err3.message : "exists");
}

test();
