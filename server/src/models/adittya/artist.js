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

