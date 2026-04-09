import {supabase} from '../../../config/database.js';

export const db_searchEvents = async (search, filter) => {
    // Start query: select events + join with user table (as organizer)
    let query = supabase
      .from('event')
      .select(`
        id, title, description, type, is_free, category_id,
        organizer:user!organizer_id (
          id,
          firstname,
          lastname
        )
      `);

    // ---------- SEARCH ----------
    if (search && search.searchby && search.query) {
      const searchTerm = `%${search.query}%`;

      if (search.searchby === 'title') {
        query = query.ilike('title', `${searchTerm}`);
      } 
      else if (search.searchby === 'organizer') {
        // Search in organizer's firstname OR lastname
        query = query.or(
          `organizer.firstname.ilike.${searchTerm},organizer.lastname.ilike.${searchTerm}`
        )
      }
    }

    // ---------- FILTERS ----------
    if (filter) {
      // Category filter: only apply if category is not -1
      if (filter.category !== undefined && filter.category !== -1) {
        query = query.eq('category_id', `${filter.category}`);
      }

      // Paid filter (is_free)
      if (filter.paid !== undefined && filter.paid !== null) {
        // paid: true means NOT free (is_free = false)
        // paid: false means free (is_free = true)
        // Adjust according to your business logic
        query = query.eq('is_free', `${!filter.paid}`);
      }

      // Type filter: only apply if not "All Type"
      if (filter.type && filter.type !== 'All Type') {
        query = query.eq('type', `${filter.type}`);
      }
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
        throw new Error('Failed to search events');
    }

    return data;
}