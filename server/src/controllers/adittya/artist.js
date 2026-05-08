import { supabase } from "../../config/database.js";

const defaultImage =
  "https://picsum.photos/seed/stagebd-default/900/700";

const youtubeThumb = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      return v ? `https://i.ytimg.com/vi/${v}/hqdefault.jpg` : null;
    }
    if (u.hostname.includes("youtu.be")) {
      const v = u.pathname.replace("/", "");
      return v ? `https://i.ytimg.com/vi/${v}/hqdefault.jpg` : null;
    }
    return null;
  } catch {
    return null;
  }
};

const resolvePreviewImage = (mediaUrl) => {
  if (!mediaUrl) return defaultImage;
  if (
    mediaUrl.includes("i.ytimg.com") ||
    mediaUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ||
    mediaUrl.includes("picsum.photos")
  ) {
    return mediaUrl;
  }
  return youtubeThumb(mediaUrl) || defaultImage;
};

const buildArtistTagline = (genres) => {
  if (!genres) return "StageBD Artist";
  return genres
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
};

const buildWorkDescription = (category, artistName) => {
  return `${category || "Creative"} work by ${artistName}.`;
};

export const listArtists = async () => {
  const { data: profiles, error: profileError } = await supabase
    .from("artist_profiles")
    .select("username, bio, genres, social_links, created_at")
    .order("created_at", { ascending: true });

  if (profileError) throw profileError;

  const usernames = (profiles || []).map((p) => p.username);
  if (usernames.length === 0) return [];

  const { data: users, error: userError } = await supabase
    .from("user")
    .select("username, firstname, lastname, city, avatar_url")
    .in("username", usernames);

  if (userError) throw userError;

  const userMap = new Map((users || []).map((u) => [u.username, u]));

  return (profiles || []).map((profile) => {
    const user = userMap.get(profile.username);
    const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim();

    return {
      id: profile.username,
      username: profile.username,
      name: fullName || profile.username,
      category: "Artist",
      city: user?.city || "Bangladesh",
      bio: profile.bio || "",
      genres: profile.genres || "",
      image: user?.avatar_url || defaultImage,
      tagline: buildArtistTagline(profile.genres),
      socialLinks: profile.social_links || {},
    };
  });
};

export const getArtistByUsername = async (username) => {
  const { data: profile, error: profileError } = await supabase
    .from("artist_profiles")
    .select("username, bio, genres, social_links")
    .eq("username", username)
    .maybeSingle();

  if (profileError) throw profileError;

  const { data: user, error: userError } = await supabase
    .from("user")
    .select("username, firstname, lastname, city, avatar_url")
    .eq("username", username)
    .maybeSingle();

  if (userError) throw userError;

  const { data: works, error: worksError } = await supabase
    .from("artist_media")
    .select("media_id, title, category, media_url, created_at")
    .eq("username", username)
    .order("created_at", { ascending: false });

  if (worksError) throw worksError;

  if (!profile && !user) return null;

  const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim();

  return {
    id: username,
    username,
    name: fullName || username,
    category: "Artist",
    city: user?.city || "Bangladesh",
    bio: profile?.bio || "",
    genres: profile?.genres || "",
    image: user?.avatar_url || defaultImage,
    tagline: buildArtistTagline(profile?.genres || ""),
    socialLinks: profile?.social_links || {},
    works: (works || []).map((work) => ({
      id: work.media_id,
      title: work.title,
      type: work.category || "Media",
      category: work.category || "Media",
      description: buildWorkDescription(work.category, fullName || username),
      link: work.media_url,
      image: resolvePreviewImage(work.media_url),
      showcase: ["Illustration", "Digital Art", "Poster", "Digital Media", "Performance Visual", "Brand Design"].includes(work.category || ""),
    })),
  };
};

export const listShowcaseItems = async () => {
  const { data: mediaRows, error: mediaError } = await supabase
    .from("artist_media")
    .select("media_id, username, title, category, media_url, created_at")
    .order("created_at", { ascending: false });

  if (mediaError) throw mediaError;

  const allowed = new Set([
    "Illustration",
    "Digital Art",
    "Poster",
    "Digital Media",
    "Performance Visual",
    "Brand Design",
  ]);

  const filtered = (mediaRows || []).filter((m) => allowed.has(m.category || ""));
  const usernames = [...new Set(filtered.map((m) => m.username))];

  const { data: users, error: userError } = await supabase
    .from("user")
    .select("username, firstname, lastname, city")
    .in("username", usernames);

  if (userError) throw userError;

  const userMap = new Map((users || []).map((u) => [u.username, u]));

  return filtered.map((work) => {
    const user = userMap.get(work.username);
    const artistName =
      [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() || work.username;

    return {
      id: work.media_id,
      title: work.title,
      type: work.category || "Media",
      category: work.category || "Media",
      description: buildWorkDescription(work.category, artistName),
      link: work.media_url,
      image: resolvePreviewImage(work.media_url),
      artistId: work.username,
      artistName,
      artistCity: user?.city || "Bangladesh",
    };
  });
};

export const upsertArtistProfile = async ({ username, bio, genres, social_links }) => {
  const { data, error } = await supabase
    .from("artist_profiles")
    .upsert(
      [{ username, bio, genres, social_links }],
      { onConflict: "username" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateArtistCoverImage = async (req, res) => {
  try {
    const { username, requesting_username, avatar_url } = req.body;

    if (!username || !requesting_username || !avatar_url) {
      return res.status(400).json({
        success: false,
        message: "username, requesting_username, and avatar_url are required.",
      });
    }

    if (username.toLowerCase() !== requesting_username.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own cover picture.",
      });
    }

    const { data: user, error: userError } = await supabase
      .from("user")
      .select("id, username")
      .eq("username", username)
      .maybeSingle();

    if (userError) throw userError;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const { data, error } = await supabase
      .from("user")
      .update({ avatar_url })
      .eq("username", username)
      .select("id, username, avatar_url")
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Cover picture updated successfully.",
      data,
    });
  } catch (error) {
    console.error("updateArtistCoverImage error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update cover picture.",
      error: error.message,
    });
  }
};

export const addArtistMedia = async ({ username, title, category, media_url }) => {
  const { data, error } = await supabase
    .from("artist_media")
    .insert([{ username, title, category, media_url }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateArtistMedia = async ({ media_id, username, title, category, media_url }) => {
  const { data, error } = await supabase
    .from("artist_media")
    .update({ title, category, media_url })
    .eq("media_id", media_id)
    .eq("username", username)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const checkUserArtistRoleAndProfile = async (username) => {
  const { data: user, error: userError } = await supabase
    .from("user")
    .select("id, username, firstname, lastname, city, bio, avatar_url")
    .eq("username", username)
    .maybeSingle();

  if (userError) throw userError;

  if (!user) {
    return {
      user: null,
      isArtist: false,
      hasArtistProfile: false,
      artistProfile: null,
    };
  }

  const { data: roleRows, error: roleError } = await supabase
    .from("user_role")
    .select("role")
    .eq("user_id", user.id);

  if (roleError) throw roleError;

  const isArtist = (roleRows || []).some(
    (row) => String(row.role).toLowerCase() === "artist"
  );

  const { data: artistProfile, error: profileError } = await supabase
    .from("artist_profiles")
    .select("profile_id, username, bio, genres, social_links, created_at")
    .eq("username", username)
    .maybeSingle();

  if (profileError) throw profileError;

  return {
    user,
    isArtist,
    hasArtistProfile: !!artistProfile,
    artistProfile: artistProfile || null,
  };
};

export const getArtistProfileStatus = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "username is required.",
      });
    }

    const data = await checkUserArtistRoleAndProfile(username);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("getArtistProfileStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check artist profile status.",
      error: error.message,
    });
  }
};

export const createArtistProfile = async (req, res) => {
  try {
    const { username, bio, genres, social_links } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "username is required.",
      });
    }

    const status = await checkUserArtistRoleAndProfile(username);

    if (!status.user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!status.isArtist) {
      return res.status(403).json({
        success: false,
        message: "Only users with artist role can create an artist portfolio.",
      });
    }

    if (status.hasArtistProfile) {
      return res.status(409).json({
        success: false,
        message: "Artist portfolio already exists for this user.",
      });
    }

    const fullName = [status.user.firstname, status.user.lastname]
      .filter(Boolean)
      .join(" ")
      .trim();

    const { data, error } = await supabase
      .from("artist_profiles")
      .insert([
        {
          username,
          bio:
            bio ||
            status.user.bio ||
            `${fullName || username} is an artist on StageBD.`,
          genres: genres || "",
          social_links: social_links || {},
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Artist portfolio created successfully.",
      data,
    });
  } catch (error) {
    console.error("createArtistProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create artist portfolio.",
      error: error.message,
    });
  }
};


export const followArtist = async ({ follower_username, followed_username }) => {
  const { data: existing, error: existingError } = await supabase
    .from("followers")
    .select("id")
    .eq("follower_username", follower_username)
    .eq("followed_username", followed_username)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return { alreadyFollowed: true };

  const { data, error } = await supabase
    .from("followers")
    .insert([{ follower_username, followed_username }])
    .select()
    .single();

  if (error) throw error;
  return { alreadyFollowed: false, data };
};

export const createSponsorshipRequest = async (req, res) => {
  try {
    const {
      artist_username,
      requesting_username,
      sponsor_username,
      sponsor_name,
      message,
      requested_amount,
    } = req.body;

    if (
      !artist_username ||
      !requesting_username ||
      !sponsor_username ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "artist_username, requesting_username, sponsor_username, and message are required.",
      });
    }

    if (artist_username.toLowerCase() !== requesting_username.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "You can only request sponsorship for your own artist account.",
      });
    }

    const numericRequestedAmount = Number(requested_amount);

    if (!numericRequestedAmount || numericRequestedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Requested amount must be greater than 0.",
      });
    }

    const artistStatus = await checkUserArtistRoleAndProfile(artist_username);

    if (!artistStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Artist user not found.",
      });
    }

    if (!artistStatus.isArtist) {
      return res.status(403).json({
        success: false,
        message: "Only users with artist role can request sponsorship.",
      });
    }

    if (!artistStatus.hasArtistProfile) {
      return res.status(403).json({
        success: false,
        message:
          "You must create your artist portfolio before requesting sponsorship.",
      });
    }

    const sponsorStatus = await checkUserHasRole(sponsor_username, "sponsor");

    if (!sponsorStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Sponsor user not found in database.",
      });
    }

    if (!sponsorStatus.hasRole) {
      return res.status(403).json({
        success: false,
        message: "Selected user does not have sponsor role.",
      });
    }

    const { data: sponsorProfile, error: sponsorProfileError } = await supabase
      .from("sponsor_profiles")
      .select("id, sponsor_id, min_budget, max_budget, is_public, sponsor_name")
      .eq("sponsor_id", sponsorStatus.user.id)
      .maybeSingle();

    if (sponsorProfileError) throw sponsorProfileError;

    if (!sponsorProfile || sponsorProfile.is_public === false) {
      return res.status(400).json({
        success: false,
        message: "Selected sponsor does not have a public sponsor listing.",
      });
    }

    const minBudget = Number(sponsorProfile.min_budget || 0);
    const maxBudget = Number(sponsorProfile.max_budget || 0);

    if (
      numericRequestedAmount < minBudget ||
      numericRequestedAmount > maxBudget
    ) {
      return res.status(400).json({
        success: false,
        message: `Requested amount must be between ${minBudget} and ${maxBudget}.`,
      });
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

    return res.status(201).json({
      success: true,
      message: `Sponsorship request sent to ${
        sponsorProfile.sponsor_name || sponsor_name || sponsor_username
      } successfully.`,
      data,
    });
  } catch (error) {
    console.error("createSponsorshipRequest error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create sponsorship request.",
      error: error.message,
    });
  }
};

export const getSponsorshipRequestsByArtist = async (req, res) => {
  try {
    const { username } = req.params;

    const artistStatus = await checkUserArtistRoleAndProfile(username);

    if (!artistStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Artist user not found.",
      });
    }

    if (!artistStatus.isArtist) {
      return res.status(403).json({
        success: false,
        message: "Only artist users can view sponsorship requests.",
      });
    }

    const { data, error } = await supabase
      .from("sponsorship_request")
      .select(
        "id, artist_id, sponsor_id, message, status, requested_amount, created_at"
      )
      .eq("artist_id", artistStatus.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("getSponsorshipRequestsByArtist error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load sponsorship requests.",
      error: error.message,
    });
  }
};

const checkUserHasRole = async (username, roleName) => {
  const { data: user, error: userError } = await supabase
    .from("user")
    .select("id, username, firstname, lastname, city")
    .eq("username", username)
    .maybeSingle();

  if (userError) throw userError;

  if (!user) {
    return {
      user: null,
      hasRole: false,
    };
  }

  const { data: roleRows, error: roleError } = await supabase
    .from("user_role")
    .select("role")
    .eq("user_id", user.id);

  if (roleError) throw roleError;

  const hasRole = (roleRows || []).some(
    (row) => String(row.role).toLowerCase() === roleName.toLowerCase()
  );

  return {
    user,
    hasRole,
  };
};

export const getSponsorshipRequestsForSponsor = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Sponsor username is required.",
      });
    }

    const sponsorStatus = await checkUserHasRole(username, "sponsor");

    if (!sponsorStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Sponsor user not found.",
      });
    }

    if (!sponsorStatus.hasRole) {
      return res.status(403).json({
        success: false,
        message: "Only sponsor users can view incoming sponsorship requests.",
      });
    }

    const { data: requests, error } = await supabase
      .from("sponsorship_request")
      .select(
        "id, artist_id, sponsor_id, message, status, requested_amount, created_at"
      )
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

    const formatted = (requests || []).map((request) => {
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

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("getSponsorshipRequestsForSponsor error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load sponsor requests.",
      error: error.message,
    });
  }
};

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

export const getPublicSponsorProfiles = async (req, res) => {
  try {
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

    const formatted = (profiles || []).map((profile) =>
      formatSponsorProfile(profile, userMap.get(profile.sponsor_id))
    );

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("getPublicSponsorProfiles error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load public sponsor profiles.",
      error: error.message,
    });
  }
};

export const getMySponsorProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Sponsor username is required.",
      });
    }

    const sponsorStatus = await checkUserHasRole(username, "sponsor");

    if (!sponsorStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Sponsor user not found.",
      });
    }

    if (!sponsorStatus.hasRole) {
      return res.status(403).json({
        success: false,
        message: "Only sponsor users can view sponsor profile settings.",
      });
    }

    const { data: profile, error } = await supabase
      .from("sponsor_profiles")
      .select(
        "id, sponsor_id, sponsor_name, sponsor_type, focus_areas, city, min_budget, max_budget, description, preferred_artists, is_public, created_at, updated_at"
      )
      .eq("sponsor_id", sponsorStatus.user.id)
      .maybeSingle();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data: profile ? formatSponsorProfile(profile, sponsorStatus.user) : null,
    });
  } catch (error) {
    console.error("getMySponsorProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load sponsor profile.",
      error: error.message,
    });
  }
};

export const upsertMySponsorProfile = async (req, res) => {
  try {
    const {
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
    } = req.body;

    if (!sponsor_username || !sponsor_name || !description) {
      return res.status(400).json({
        success: false,
        message: "sponsor_username, sponsor_name, and description are required.",
      });
    }

    const minBudget = Number(min_budget);
    const maxBudget = Number(max_budget);

    if (!minBudget || !maxBudget || minBudget <= 0 || maxBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid min_budget and max_budget are required.",
      });
    }

    if (minBudget > maxBudget) {
      return res.status(400).json({
        success: false,
        message: "Minimum budget cannot be greater than maximum budget.",
      });
    }

    const sponsorStatus = await checkUserHasRole(sponsor_username, "sponsor");

    if (!sponsorStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Sponsor user not found.",
      });
    }

    if (!sponsorStatus.hasRole) {
      return res.status(403).json({
        success: false,
        message: "Only sponsor users can create or update sponsor listings.",
      });
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

    return res.status(200).json({
      success: true,
      message: "Sponsor listing saved successfully.",
      data: formatSponsorProfile(data, sponsorStatus.user),
    });
  } catch (error) {
    console.error("upsertMySponsorProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save sponsor profile.",
      error: error.message,
    });
  }
};

export const updateSponsorshipRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { sponsor_username, status } = req.body;

    if (!requestId || !sponsor_username || !status) {
      return res.status(400).json({
        success: false,
        message: "requestId, sponsor_username, and status are required.",
      });
    }

    const normalizedStatus = String(status).toLowerCase();
    const allowedStatuses = ["pending", "approved", "rejected", "offered"];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Status must be pending, approved, or rejected.",
      });
    }

    const sponsorStatus = await checkUserHasRole(sponsor_username, "sponsor");

    if (!sponsorStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Sponsor user not found.",
      });
    }

    if (!sponsorStatus.hasRole) {
      return res.status(403).json({
        success: false,
        message: "Only sponsor users can update sponsorship request status.",
      });
    }

    const { data: request, error: requestError } = await supabase
      .from("sponsorship_request")
      .select("id, sponsor_id")
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) throw requestError;

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Sponsorship request not found.",
      });
    }

    if (request.sponsor_id !== sponsorStatus.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only manage requests sent to your sponsor account.",
      });
    }

    const { data, error } = await supabase
      .from("sponsorship_request")
      .update({ status: normalizedStatus })
      .eq("id", requestId)
      .eq("sponsor_id", sponsorStatus.user.id)
      .select(
        "id, artist_id, sponsor_id, message, status, requested_amount, created_at"
      )
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Sponsorship request status updated successfully.",
      data,
    });
  } catch (error) {
    console.error("updateSponsorshipRequestStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update sponsorship request status.",
      error: error.message,
    });
  }
};

export const getAvailableArtistsForSponsor = async (req, res) => {
  try {
    const { sponsorUsername } = req.params;

    if (!sponsorUsername) {
      return res.status(400).json({
        success: false,
        message: "Sponsor username is required.",
      });
    }

    const sponsorStatus = await checkUserHasRole(sponsorUsername, "sponsor");

    if (!sponsorStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Sponsor user not found.",
      });
    }

    if (!sponsorStatus.hasRole) {
      return res.status(403).json({
        success: false,
        message: "Only sponsor users can browse artists for sponsorship offers.",
      });
    }

    const artists = await listArtists();

    return res.status(200).json({
      success: true,
      data: artists || [],
    });
  } catch (error) {
    console.error("getAvailableArtistsForSponsor error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load artists for sponsor.",
      error: error.message,
    });
  }
};

export const createSponsorOffer = async (req, res) => {
  try {
    const {
      sponsor_username,
      artist_username,
      message,
      offered_amount,
    } = req.body;

    if (!sponsor_username || !artist_username || !message || !offered_amount) {
      return res.status(400).json({
        success: false,
        message:
          "sponsor_username, artist_username, message, and offered_amount are required.",
      });
    }

    const numericAmount = Number(offered_amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Offered amount must be greater than 0.",
      });
    }

    const sponsorStatus = await checkUserHasRole(sponsor_username, "sponsor");

    if (!sponsorStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Sponsor user not found.",
      });
    }

    if (!sponsorStatus.hasRole) {
      return res.status(403).json({
        success: false,
        message: "Only sponsor users can create sponsorship offers.",
      });
    }

    const artistStatus = await checkUserArtistRoleAndProfile(artist_username);

    if (!artistStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Artist user not found.",
      });
    }

    if (!artistStatus.isArtist) {
      return res.status(403).json({
        success: false,
        message: "Selected user does not have artist role.",
      });
    }

    if (!artistStatus.hasArtistProfile) {
      return res.status(403).json({
        success: false,
        message:
          "Selected artist must have an artist portfolio before receiving sponsorship offers.",
      });
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
      .select(
        "id, artist_id, sponsor_id, message, status, requested_amount, created_at"
      )
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Sponsorship offer sent successfully.",
      data,
    });
  } catch (error) {
    console.error("createSponsorOffer error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create sponsorship offer.",
      error: error.message,
    });
  }
};

export const updateSponsorOfferByArtist = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { artist_username, status } = req.body;

    if (!requestId || !artist_username || !status) {
      return res.status(400).json({
        success: false,
        message: "requestId, artist_username, and status are required.",
      });
    }

    const normalizedStatus = String(status).toLowerCase();
    const allowedStatuses = ["accepted", "rejected"];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected.",
      });
    }

    const artistStatus = await checkUserArtistRoleAndProfile(artist_username);

    if (!artistStatus.user) {
      return res.status(404).json({
        success: false,
        message: "Artist user not found.",
      });
    }

    if (!artistStatus.isArtist) {
      return res.status(403).json({
        success: false,
        message: "Only artist users can respond to sponsor offers.",
      });
    }

    const { data: request, error: requestError } = await supabase
      .from("sponsorship_request")
      .select("id, artist_id, status")
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) throw requestError;

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Sponsorship offer not found.",
      });
    }

    if (request.artist_id !== artistStatus.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only respond to offers sent to your artist account.",
      });
    }

    if (String(request.status).toLowerCase() !== "offered") {
      return res.status(400).json({
        success: false,
        message: "Only offered sponsorships can be accepted or rejected.",
      });
    }

    const { data, error } = await supabase
      .from("sponsorship_request")
      .update({ status: normalizedStatus })
      .eq("id", requestId)
      .eq("artist_id", artistStatus.user.id)
      .select(
        "id, artist_id, sponsor_id, message, status, requested_amount, created_at"
      )
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Sponsor offer response saved successfully.",
      data,
    });
  } catch (error) {
    console.error("updateSponsorOfferByArtist error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to respond to sponsor offer.",
      error: error.message,
    });
  }
};

export const getArtists = async (req, res) => {
  try {
    const data = await listArtists();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getArtists error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load artists.",
      error: error.message,
    });
  }
};

export const getArtistDetails = async (req, res) => {
  try {
    const { username } = req.params;
    const data = await getArtistByUsername(username);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Artist not found.",
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getArtistDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load artist details.",
      error: error.message,
    });
  }
};

export const getShowcase = async (req, res) => {
  try {
    const data = await listShowcaseItems();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("getShowcase error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load showcase items.",
      error: error.message,
    });
  }
};

export const saveArtistProfile = async (req, res) => {
  try {
    const { username, bio, genres, social_links } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "username is required.",
      });
    }

    const status = await checkUserArtistRoleAndProfile(username);

    if (!status.user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!status.isArtist) {
      return res.status(403).json({
        success: false,
        message: "Only artist users can update artist portfolios.",
      });
    }

    if (!status.hasArtistProfile) {
      return res.status(404).json({
        success: false,
        message: "Artist portfolio does not exist yet. Create it first.",
      });
    }

    const { data, error } = await supabase
      .from("artist_profiles")
      .update({
        bio,
        genres,
        social_links,
      })
      .eq("username", username)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Artist profile updated successfully.",
      data,
    });
  } catch (error) {
    console.error("saveArtistProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save artist profile.",
      error: error.message,
    });
  }
};

export const createArtistMedia = async (req, res) => {
  try {
    const { username, title, category, media_url } = req.body;

    if (!username || !title || !media_url) {
      return res.status(400).json({
        success: false,
        message: "username, title, and media_url are required.",
      });
    }

    const data = await addArtistMedia({
      username,
      title,
      category,
      media_url,
    });

    return res.status(201).json({
      success: true,
      message: "Artist media created successfully.",
      data,
    });
  } catch (error) {
    console.error("createArtistMedia error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create artist media.",
      error: error.message,
    });
  }
};

export const editArtistMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { username, title, category, media_url } = req.body;

    if (!username || !mediaId) {
      return res.status(400).json({
        success: false,
        message: "username and mediaId are required.",
      });
    }

    const data = await updateArtistMedia({
      media_id: mediaId,
      username,
      title,
      category,
      media_url,
    });

    return res.status(200).json({
      success: true,
      message: "Artist media updated successfully.",
      data,
    });
  } catch (error) {
    console.error("editArtistMedia error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update artist media.",
      error: error.message,
    });
  }
};

export const createFollow = async (req, res) => {
  try {
    const { follower_username, followed_username } = req.body;

    if (!follower_username || !followed_username) {
      return res.status(400).json({
        success: false,
        message: "follower_username and followed_username are required.",
      });
    }

    const data = await followArtist({
      follower_username,
      followed_username,
    });

    return res.status(200).json({
      success: true,
      message: data.alreadyFollowed
        ? "Already following this artist."
        : "Follow created successfully.",
      data,
    });
  } catch (error) {
    console.error("createFollow error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to follow artist.",
      error: error.message,
    });
  }
};
export const listCampaigns = async () => {
  const { data: campaigns, error } = await supabase
    .from("campaign")
    .select("id, artist_id, title, description, goal_amount, raised_amount, deadline, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const artistIds = [...new Set((campaigns || []).map((c) => c.artist_id).filter(Boolean))];

  let userMap = new Map();

  if (artistIds.length > 0) {
    const { data: users, error: userError } = await supabase
      .from("user")
      .select("id, username, firstname, lastname")
      .in("id", artistIds);

    if (userError) throw userError;

    userMap = new Map((users || []).map((u) => [u.id, u]));
  }

  return (campaigns || []).map((campaign) => {
    const artist = userMap.get(campaign.artist_id);
    const artistName =
      [artist?.firstname, artist?.lastname].filter(Boolean).join(" ").trim() ||
      artist?.username ||
      "Unknown Artist";

    return {
      id: campaign.id,
      artist_id: campaign.artist_id,
      artistName,
      title: campaign.title || "",
      description: campaign.description || "",
      goalAmount: Number(campaign.goal_amount || 0),
      raisedAmount: Number(campaign.raised_amount || 0),
      deadline: campaign.deadline,
      created_at: campaign.created_at,
    };
  });
};

export const createCampaignForArtist = async (req, res) => {
  try {
    const {
      username,
      requesting_username,
      title,
      description,
      goal_amount,
      deadline,
    } = req.body;

    if (
      !username ||
      !requesting_username ||
      !title ||
      !description ||
      !goal_amount ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message:
          "username, requesting_username, title, description, goal_amount, and deadline are required.",
      });
    }

    if (username.toLowerCase() !== requesting_username.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "You can only create crowdfunding campaigns for yourself.",
      });
    }

    const status = await checkUserArtistRoleAndProfile(username);

    if (!status.user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!status.isArtist) {
      return res.status(403).json({
        success: false,
        message: "Only artist users can create crowdfunding campaigns.",
      });
    }

    if (!status.hasArtistProfile) {
      return res.status(403).json({
        success: false,
        message:
          "You must create your artist portfolio before creating a crowdfunding campaign.",
      });
    }

    const numericGoalAmount = Number(goal_amount);

    if (!numericGoalAmount || numericGoalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Goal amount must be greater than 0.",
      });
    }

    const { data, error } = await supabase
      .from("campaign")
      .insert([
        {
          artist_id: status.user.id,
          title,
          description,
          goal_amount: numericGoalAmount,
          raised_amount: 0,
          deadline,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Crowdfunding campaign created successfully.",
      data,
    });
  } catch (error) {
    console.error("createCampaignForArtist error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create crowdfunding campaign.",
      error: error.message,
    });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const data = await listCampaigns();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("getCampaigns error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load campaigns.",
      error: error.message,
    });
  }
};
export const createContribution = async ({ campaign_id, supporter_username, amount }) => {
  const numericAmount = Number(amount);

  if (!campaign_id || !supporter_username || !numericAmount || numericAmount <= 0) {
    throw new Error("campaign_id, supporter_username, and a valid amount are required.");
  }

  const { data: user, error: userError } = await supabase
    .from("user")
    .select("id, username")
    .eq("username", supporter_username)
    .maybeSingle();

  if (userError) throw userError;
  if (!user) throw new Error("Supporter user not found.");

  const { data: campaign, error: campaignError } = await supabase
    .from("campaign")
    .select("id, raised_amount")
    .eq("id", campaign_id)
    .maybeSingle();

  if (campaignError) throw campaignError;
  if (!campaign) throw new Error("Campaign not found.");

  const { data: contribution, error: contributionError } = await supabase
    .from("contribution")
    .insert([
      {
        campaign_id,
        user_id: user.id,
        amount: numericAmount,
      },
    ])
    .select()
    .single();

  if (contributionError) throw contributionError;

  const updatedRaisedAmount = Number(campaign.raised_amount || 0) + numericAmount;

  const { error: updateError } = await supabase
    .from("campaign")
    .update({ raised_amount: updatedRaisedAmount })
    .eq("id", campaign_id);

  if (updateError) throw updateError;

  return {
    contribution,
    updatedRaisedAmount,
  };
};

export const saveContribution = async (req, res) => {
  try {
    const { campaign_id, supporter_username, amount } = req.body;

    const data = await createContribution({
      campaign_id,
      supporter_username,
      amount,
    });

    return res.status(201).json({
      success: true,
      message: "Contribution saved successfully.",
      data,
    });
  } catch (error) {
    console.error("saveContribution error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save contribution.",
    });
  }
};

export const listEventAnalytics = async (organizerUsername) => {
  if (!organizerUsername) {
    const error = new Error("Organizer username is required.");
    error.statusCode = 400;
    throw error;
  }

  const { data: organizerUser, error: userError } = await supabase
    .from("user")
    .select("id, username")
    .eq("username", organizerUsername)
    .maybeSingle();

  if (userError) throw userError;

  if (!organizerUser) {
    const error = new Error("Organizer user not found.");
    error.statusCode = 404;
    throw error;
  }

  const { data: roleRows, error: roleError } = await supabase
    .from("user_role")
    .select("role")
    .eq("user_id", organizerUser.id);

  if (roleError) throw roleError;

  const isOrganizer = (roleRows || []).some(
    (row) => String(row.role).toLowerCase() === "organizer"
  );

  if (!isOrganizer) {
    const error = new Error("Only organizer users can view analytics.");
    error.statusCode = 403;
    throw error;
  }

  const { data: events, error: eventsError } = await supabase
    .from("event")
    .select("id, title, organizer_id")
    .eq("organizer_id", organizerUser.id)
    .order("title", { ascending: true });

  if (eventsError) throw eventsError;

  const organizerEventIds = (events || []).map((event) => event.id);

  const eventMap = new Map();
  const analyticsMap = new Map();

  (events || []).forEach((event) => {
    eventMap.set(event.id, event);

    analyticsMap.set(event.id, {
      eventId: event.id,
      eventTitle: event.title || "Untitled Event",
      reservations: 0,
      promoUses: 0,
      uniqueUserSet: new Set(),
      promoCodeIdSet: new Set(),
      reservationCodeSet: new Set(),
    });
  });

  if (organizerEventIds.length === 0) {
    return [];
  }

  const { data: reservations, error: reservationError } = await supabase
    .from("reservation")
    .select(
      "id, user_id, event_id, promo_code_id, ticket_slot_id, reservation_code"
    )
    .in("event_id", organizerEventIds);

  if (reservationError) throw reservationError;

  (reservations || []).forEach((reservation) => {
    const eventId = reservation.event_id;

    if (!analyticsMap.has(eventId)) {
      return;
    }

    const item = analyticsMap.get(eventId);

    item.reservations += 1;

    if (reservation.user_id) {
      item.uniqueUserSet.add(String(reservation.user_id));
    }

    if (reservation.promo_code_id) {
      item.promoUses += 1;
      item.promoCodeIdSet.add(String(reservation.promo_code_id));
    }

    if (reservation.reservation_code) {
      item.reservationCodeSet.add(String(reservation.reservation_code));
    }
  });

  return Array.from(analyticsMap.values()).map((item) => ({
    eventId: item.eventId,
    eventTitle: item.eventTitle,
    reservations: item.reservations,
    promoUses: item.promoUses,
    uniqueUsers: item.uniqueUserSet.size,
    promoCodeIds: Array.from(item.promoCodeIdSet),
    reservationCodes: Array.from(item.reservationCodeSet),
  }));
};

export const getEventAnalytics = async (req, res) => {
  try {
    const { username } = req.query;

    const data = await listEventAnalytics(username);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("getEventAnalytics error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to load event analytics.",
    });
  }
};