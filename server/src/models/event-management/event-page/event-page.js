import {supabase} from "../../../config/database.js";

export const db_getEventDetails = async (eventId) => {
    const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('id', `${eventId}`)
        .single();

    if (error) {
        console.error(`Error fetching event details for id ${eventId}:`, error);
        throw new Error(error.message);
    }
    return data;
};

export const db_getCategoryName = async (categoryId) => {
    const { data, error } = await supabase
        .from('event_category')
        .select('name')
        .eq('id', `${categoryId}`)
        .single();
    
    if (error) {
        console.error(`Error fetching category name for id ${categoryId}:`, error);
        throw new Error(error.message);
    }
    return data.name;
};

export const db_getVenue = async (venueId) => {
    const { data, error } = await supabase
        .from('venue')
        .select('name, address,city, capacity')
        .eq('id', `${venueId}`)
        .single();
    
    if (error) {
        console.error(`Error fetching venue for id ${venueId}:`, error);
        throw new Error(error.message);
    }
    return data;
};