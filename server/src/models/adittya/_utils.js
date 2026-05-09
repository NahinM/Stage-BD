import { supabase } from "../../config/database.js";

export { supabase };

export const defaultImage =
  "https://picsum.photos/seed/stagebd-default/900/700";

export const showcaseCategories = [
  "Illustration",
  "Digital Art",
  "Poster",
  "Digital Media",
  "Performance Visual",
  "Brand Design",
];

export const makeError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const youtubeThumb = (url) => {
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

export const resolvePreviewImage = (mediaUrl) => {
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

export const buildArtistTagline = (genres) => {
  if (!genres) return "StageBD Artist";

  return genres
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
};

export const buildWorkDescription = (category, artistName) => {
  return `${category || "Creative"} work by ${artistName}.`;
};

export const checkUserHasRole = async (username, roleName) => {
  const { data: user, error: userError } = await supabase
    .from("user")
    .select("id, username, firstname, lastname, city, bio, avatar_url")
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