import {supabase} from '../../../config/database.js';

export const db_searchEvents = async (queryData) => {
    // Start query: select events + join with user table (as organizer)
    let query = supabase
        .from('event')
        .select("id,title,description,type,is_free,category_id")

    if(queryData.searchBy === "title" && queryData.searchValue.trim() !== "") {
        query = query.ilike('title', `%${queryData.searchValue}%`);
    }
    if(queryData.searchBy === "organizer" && queryData.userId.trim() !== "") {
        query = query.eq('organizer_id', `${queryData.userId}`);
    }

    if(queryData.categoryId !== -1) {
        query = query.eq('category_id', `${queryData.categoryId}`);
    }
    if(queryData.isFree !== null) {
        query = query.eq('is_free', queryData.isFree);
    }
    if(queryData.type !== "all types") {
        query = query.eq('type', `${queryData.type}`);
    }

    // Execute the query
    const { data, error } = await query;
    if (error) {
      console.error('Supabase error:', error);
        throw new Error('Failed to search events');
    }

    return data;
}