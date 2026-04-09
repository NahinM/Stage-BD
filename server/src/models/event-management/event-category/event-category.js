import {supabase} from '../../../config/database.js';

export const db_getEventCategories = async () => {
    const { data, error } = await supabase
        .from('event_category')
        .select('*');

    if (error) {
        console.error('Error fetching event categories:', error);
        throw error;
    }
    return data;
}