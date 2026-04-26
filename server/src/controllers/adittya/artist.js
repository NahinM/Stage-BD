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
    const { artist_username, sponsor_name, message } = req.body;

    if (!artist_username || !sponsor_name || !message) {
      return res.status(400).json({
        success: false,
        message: "artist_username, sponsor_name, and message are required.",
      });
    }

    const { data: artistUser, error: artistError } = await supabase
      .from("user")
      .select("id, username")
      .eq("username", artist_username)
      .maybeSingle();

    if (artistError) throw artistError;

    if (!artistUser) {
      return res.status(404).json({
        success: false,
        message: "Artist user not found.",
      });
    }

    const sponsorMap = {
      "Bangla Culture Foundation": "bangla_culture_foundation",
      "Creative Youth Media": "creative_youth_media",
      "Rupali Events & Patron Circle": "rupali_events_patron_circle",
    };

    const sponsorUsername = sponsorMap[sponsor_name];

    if (!sponsorUsername) {
      return res.status(400).json({
        success: false,
        message: "Selected sponsor is not recognized.",
      });
    }

    const { data: sponsorUser, error: sponsorError } = await supabase
      .from("user")
      .select("id, username")
      .eq("username", sponsorUsername)
      .maybeSingle();

    if (sponsorError) throw sponsorError;

    if (!sponsorUser) {
      return res.status(404).json({
        success: false,
        message: "Sponsor user not found in database.",
      });
    }

    const { data, error } = await supabase
      .from("sponsorship_request")
      .insert([
        {
          artist_id: artistUser.id,
          sponsor_id: sponsorUser.id,
          message,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Sponsorship request created successfully.",
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

    const { data: artistUser, error: artistError } = await supabase
      .from("user")
      .select("id, username")
      .eq("username", username)
      .maybeSingle();

    if (artistError) throw artistError;

    if (!artistUser) {
      return res.status(404).json({
        success: false,
        message: "Artist user not found.",
      });
    }

    const { data, error } = await supabase
      .from("sponsorship_request")
      .select("id, artist_id, sponsor_id, message, status, created_at")
      .eq("artist_id", artistUser.id)
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

    const data = await upsertArtistProfile({
      username,
      bio,
      genres,
      social_links,
    });

    return res.status(200).json({
      success: true,
      message: "Artist profile saved successfully.",
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
export const listEventAnalytics = async () => {
  const { data: analyticsRows, error: analyticsError } = await supabase
    .from("event_analytics")
    .select("event_id, views, reservations, attendance, promo_uses");

  if (analyticsError) throw analyticsError;

  const eventIds = [...new Set((analyticsRows || []).map((row) => row.event_id).filter(Boolean))];

  let eventMap = new Map();

  if (eventIds.length > 0) {
    const { data: events, error: eventsError } = await supabase
      .from("event")
      .select("id, title")
      .in("id", eventIds);

    if (eventsError) throw eventsError;

    eventMap = new Map((events || []).map((event) => [event.id, event]));
  }

  return (analyticsRows || []).map((row) => {
    const event = eventMap.get(row.event_id);

    return {
      eventId: row.event_id,
      eventTitle: event?.title || "Untitled Event",
      views: Number(row.views || 0),
      reservations: Number(row.reservations || 0),
      attendance: Number(row.attendance || 0),
      promoUses: Number(row.promo_uses || 0),
    };
  });
};

export const getEventAnalytics = async (req, res) => {
  try {
    const data = await listEventAnalytics();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("getEventAnalytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load event analytics.",
      error: error.message,
    });
  }
};