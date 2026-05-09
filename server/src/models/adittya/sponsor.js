import {
  supabase,
  makeError,
  checkUserHasRole,
  checkUserArtistRoleAndProfile,
} from "./_utils.js";

import { listArtists } from "./artist.js";

const formatSponsorProfile = (profile, user) => {
  const minBudget = Number(profile.min_budget || 0);
  const maxBudget = Number(profile.max_budget || 0);

  return {
    id: profile.id,
    sponsorId: profile.sponsor_id,
    sponsorUsername: user?.username || "",
    sponsorName: profile.sponsor_name || user?.username || "Sponsor",
    sponsorType: profile.sponsor_type || "Sponsor",
    focusAreas: profile.focus_areas || [],
    city: profile.city || user?.city || "Bangladesh",
    minBudget,
    maxBudget,
    budgetRange:
      minBudget && maxBudget
        ? `৳${minBudget.toLocaleString()} - ৳${maxBudget.toLocaleString()}`
        : "Budget not specified",
    description: profile.description || "",
    preferredArtists: profile.preferred_artists || [],
    isPublic: profile.is_public !== false,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
};

export const listPublicSponsorProfiles = async () => {
  const { data: profiles, error: profileError } = await supabase
    .from("sponsor_profiles")
    .select(
      "id, sponsor_id, sponsor_name, sponsor_type, focus_areas, city, min_budget, max_budget, description, preferred_artists, is_public, created_at, updated_at"
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (profileError) throw profileError;

  const sponsorIds = [
    ...new Set((profiles || []).map((profile) => profile.sponsor_id)),
  ].filter(Boolean);

  let userMap = new Map();

  if (sponsorIds.length > 0) {
    const { data: users, error: userError } = await supabase
      .from("user")
      .select("id, username, firstname, lastname, city")
      .in("id", sponsorIds);

    if (userError) throw userError;

    userMap = new Map((users || []).map((user) => [user.id, user]));
  }

  return (profiles || []).map((profile) =>
    formatSponsorProfile(profile, userMap.get(profile.sponsor_id))
  );
};

export const getMySponsorProfileRecord = async (username) => {
  const sponsorStatus = await checkUserHasRole(username, "sponsor");

  if (!sponsorStatus.user) throw makeError("Sponsor user not found.", 404);

  if (!sponsorStatus.hasRole) {
    throw makeError("Only sponsor users can view sponsor profile settings.", 403);
  }

  const { data: profile, error } = await supabase
    .from("sponsor_profiles")
    .select(
      "id, sponsor_id, sponsor_name, sponsor_type, focus_areas, city, min_budget, max_budget, description, preferred_artists, is_public, created_at, updated_at"
    )
    .eq("sponsor_id", sponsorStatus.user.id)
    .maybeSingle();

  if (error) throw error;

  return profile ? formatSponsorProfile(profile, sponsorStatus.user) : null;
};

export const upsertMySponsorProfileRecord = async ({
  sponsor_username,
  sponsor_name,
  sponsor_type,
  focus_areas,
  city,
  min_budget,
  max_budget,
  description,
  preferred_artists,
  is_public,
}) => {
  const minBudget = Number(min_budget);
  const maxBudget = Number(max_budget);

  if (!minBudget || !maxBudget || minBudget <= 0 || maxBudget <= 0) {
    throw makeError("Valid min_budget and max_budget are required.", 400);
  }

  if (minBudget > maxBudget) {
    throw makeError("Minimum budget cannot be greater than maximum budget.", 400);
  }

  const sponsorStatus = await checkUserHasRole(sponsor_username, "sponsor");

  if (!sponsorStatus.user) throw makeError("Sponsor user not found.", 404);

  if (!sponsorStatus.hasRole) {
    throw makeError("Only sponsor users can create or update sponsor listings.", 403);
  }

  const { data, error } = await supabase
    .from("sponsor_profiles")
    .upsert(
      [
        {
          sponsor_id: sponsorStatus.user.id,
          sponsor_name,
          sponsor_type: sponsor_type || "Sponsor",
          focus_areas: Array.isArray(focus_areas) ? focus_areas : [],
          city: city || sponsorStatus.user.city || "Bangladesh",
          min_budget: minBudget,
          max_budget: maxBudget,
          description,
          preferred_artists: Array.isArray(preferred_artists)
            ? preferred_artists
            : [],
          is_public: is_public !== false,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "sponsor_id" }
    )
    .select(
      "id, sponsor_id, sponsor_name, sponsor_type, focus_areas, city, min_budget, max_budget, description, preferred_artists, is_public, created_at, updated_at"
    )
    .single();

  if (error) throw error;

  return formatSponsorProfile(data, sponsorStatus.user);
};

export const createSponsorshipRequestRecord = async ({
  artist_username,
  requesting_username,
  sponsor_username,
  sponsor_name,
  message,
  requested_amount,
}) => {
  if (artist_username.toLowerCase() !== requesting_username.toLowerCase()) {
    throw makeError("You can only request sponsorship for your own artist account.", 403);
  }

  const numericRequestedAmount = Number(requested_amount);

  if (!numericRequestedAmount || numericRequestedAmount <= 0) {
    throw makeError("Requested amount must be greater than 0.", 400);
  }

  const artistStatus = await checkUserArtistRoleAndProfile(artist_username);

  if (!artistStatus.user) throw makeError("Artist user not found.", 404);

  if (!artistStatus.isArtist) {
    throw makeError("Only users with artist role can request sponsorship.", 403);
  }

  if (!artistStatus.hasArtistProfile) {
    throw makeError(
      "You must create your artist portfolio before requesting sponsorship.",
      403
    );
  }

  const sponsorStatus = await checkUserHasRole(sponsor_username, "sponsor");

  if (!sponsorStatus.user) throw makeError("Sponsor user not found in database.", 404);

  if (!sponsorStatus.hasRole) {
    throw makeError("Selected user does not have sponsor role.", 403);
  }

  const { data: sponsorProfile, error: sponsorProfileError } = await supabase
    .from("sponsor_profiles")
    .select("id, sponsor_id, min_budget, max_budget, is_public, sponsor_name")
    .eq("sponsor_id", sponsorStatus.user.id)
    .maybeSingle();

  if (sponsorProfileError) throw sponsorProfileError;

  if (!sponsorProfile || sponsorProfile.is_public === false) {
    throw makeError("Selected sponsor does not have a public sponsor listing.", 400);
  }

  const minBudget = Number(sponsorProfile.min_budget || 0);
  const maxBudget = Number(sponsorProfile.max_budget || 0);

  if (numericRequestedAmount < minBudget || numericRequestedAmount > maxBudget) {
    throw makeError(
      `Requested amount must be between ${minBudget} and ${maxBudget}.`,
      400
    );
  }

  const { data, error } = await supabase
    .from("sponsorship_request")
    .insert([
      {
        artist_id: artistStatus.user.id,
        sponsor_id: sponsorStatus.user.id,
        message,
        requested_amount: numericRequestedAmount,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    data,
    sponsorDisplayName:
      sponsorProfile.sponsor_name || sponsor_name || sponsor_username,
  };
};

export const getSponsorshipRequestsByArtistRecord = async (username) => {
  const artistStatus = await checkUserArtistRoleAndProfile(username);

  if (!artistStatus.user) throw makeError("Artist user not found.", 404);

  if (!artistStatus.isArtist) {
    throw makeError("Only artist users can view sponsorship requests.", 403);
  }

  const { data, error } = await supabase
    .from("sponsorship_request")
    .select("id, artist_id, sponsor_id, message, status, requested_amount, created_at")
    .eq("artist_id", artistStatus.user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
};

export const getSponsorshipRequestsForSponsorRecord = async (username) => {
  const sponsorStatus = await checkUserHasRole(username, "sponsor");

  if (!sponsorStatus.user) throw makeError("Sponsor user not found.", 404);

  if (!sponsorStatus.hasRole) {
    throw makeError("Only sponsor users can view incoming sponsorship requests.", 403);
  }

  const { data: requests, error } = await supabase
    .from("sponsorship_request")
    .select("id, artist_id, sponsor_id, message, status, requested_amount, created_at")
    .eq("sponsor_id", sponsorStatus.user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const artistIds = [
    ...new Set((requests || []).map((request) => request.artist_id)),
  ].filter(Boolean);

  let artistMap = new Map();

  if (artistIds.length > 0) {
    const { data: artists, error: artistError } = await supabase
      .from("user")
      .select("id, username, firstname, lastname, city")
      .in("id", artistIds);

    if (artistError) throw artistError;

    artistMap = new Map((artists || []).map((artist) => [artist.id, artist]));
  }

  return (requests || []).map((request) => {
    const artist = artistMap.get(request.artist_id);

    const artistName =
      [artist?.firstname, artist?.lastname].filter(Boolean).join(" ").trim() ||
      artist?.username ||
      "Unknown Artist";

    return {
      id: request.id,
      artist_id: request.artist_id,
      sponsor_id: request.sponsor_id,
      artistUsername: artist?.username || "",
      artistName,
      artistCity: artist?.city || "",
      sponsorUsername: sponsorStatus.user.username,
      message: request.message,
      status: request.status || "pending",
      requested_amount: request.requested_amount,
      created_at: request.created_at,
    };
  });
};

export const updateSponsorshipRequestStatusRecord = async ({
  requestId,
  sponsor_username,
  status,
}) => {
  const normalizedStatus = String(status).toLowerCase();
  const allowedStatuses = ["pending", "approved", "rejected", "offered"];

  if (!allowedStatuses.includes(normalizedStatus)) {
    throw makeError("Status must be pending, approved, rejected, or offered.", 400);
  }

  const sponsorStatus = await checkUserHasRole(sponsor_username, "sponsor");

  if (!sponsorStatus.user) throw makeError("Sponsor user not found.", 404);

  if (!sponsorStatus.hasRole) {
    throw makeError("Only sponsor users can update sponsorship request status.", 403);
  }

  const { data: request, error: requestError } = await supabase
    .from("sponsorship_request")
    .select("id, sponsor_id")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) throw requestError;

  if (!request) throw makeError("Sponsorship request not found.", 404);

  if (request.sponsor_id !== sponsorStatus.user.id) {
    throw makeError("You can only manage requests sent to your sponsor account.", 403);
  }

  const { data, error } = await supabase
    .from("sponsorship_request")
    .update({ status: normalizedStatus })
    .eq("id", requestId)
    .eq("sponsor_id", sponsorStatus.user.id)
    .select("id, artist_id, sponsor_id, message, status, requested_amount, created_at")
    .single();

  if (error) throw error;

  return data;
};

export const getAvailableArtistsForSponsorRecord = async (sponsorUsername) => {
  const sponsorStatus = await checkUserHasRole(sponsorUsername, "sponsor");

  if (!sponsorStatus.user) throw makeError("Sponsor user not found.", 404);

  if (!sponsorStatus.hasRole) {
    throw makeError("Only sponsor users can browse artists for sponsorship offers.", 403);
  }

  return listArtists();
};

export const createSponsorOfferRecord = async ({
  sponsor_username,
  artist_username,
  message,
  offered_amount,
}) => {
  const numericAmount = Number(offered_amount);

  if (!numericAmount || numericAmount <= 0) {
    throw makeError("Offered amount must be greater than 0.", 400);
  }

  const sponsorStatus = await checkUserHasRole(sponsor_username, "sponsor");

  if (!sponsorStatus.user) throw makeError("Sponsor user not found.", 404);

  if (!sponsorStatus.hasRole) {
    throw makeError("Only sponsor users can create sponsorship offers.", 403);
  }

  const artistStatus = await checkUserArtistRoleAndProfile(artist_username);

  if (!artistStatus.user) throw makeError("Artist user not found.", 404);

  if (!artistStatus.isArtist) {
    throw makeError("Selected user does not have artist role.", 403);
  }

  if (!artistStatus.hasArtistProfile) {
    throw makeError(
      "Selected artist must have an artist portfolio before receiving sponsorship offers.",
      403
    );
  }

  const { data, error } = await supabase
    .from("sponsorship_request")
    .insert([
      {
        artist_id: artistStatus.user.id,
        sponsor_id: sponsorStatus.user.id,
        message,
        requested_amount: numericAmount,
        status: "offered",
      },
    ])
    .select("id, artist_id, sponsor_id, message, status, requested_amount, created_at")
    .single();

  if (error) throw error;

  return data;
};

export const updateSponsorOfferByArtistRecord = async ({
  requestId,
  artist_username,
  status,
}) => {
  const normalizedStatus = String(status).toLowerCase();
  const allowedStatuses = ["accepted", "rejected"];

  if (!allowedStatuses.includes(normalizedStatus)) {
    throw makeError("Status must be accepted or rejected.", 400);
  }

  const artistStatus = await checkUserArtistRoleAndProfile(artist_username);

  if (!artistStatus.user) throw makeError("Artist user not found.", 404);

  if (!artistStatus.isArtist) {
    throw makeError("Only artist users can respond to sponsor offers.", 403);
  }

  const { data: request, error: requestError } = await supabase
    .from("sponsorship_request")
    .select("id, artist_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) throw requestError;

  if (!request) throw makeError("Sponsorship offer not found.", 404);

  if (request.artist_id !== artistStatus.user.id) {
    throw makeError("You can only respond to offers sent to your artist account.", 403);
  }

  if (String(request.status).toLowerCase() !== "offered") {
    throw makeError("Only offered sponsorships can be accepted or rejected.", 400);
  }

  const { data, error } = await supabase
    .from("sponsorship_request")
    .update({ status: normalizedStatus })
    .eq("id", requestId)
    .eq("artist_id", artistStatus.user.id)
    .select("id, artist_id, sponsor_id, message, status, requested_amount, created_at")
    .single();

  if (error) throw error;

  return data;
};