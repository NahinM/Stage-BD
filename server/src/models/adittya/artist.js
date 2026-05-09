import {
  supabase,
  defaultImage,
  showcaseCategories,
  makeError,
  resolvePreviewImage,
  buildArtistTagline,
  buildWorkDescription,
  checkUserArtistRoleAndProfile,
} from "./_utils.js";

export { checkUserArtistRoleAndProfile };

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
    const fullName = [user?.firstname, user?.lastname]
      .filter(Boolean)
      .join(" ")
      .trim();

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

  const fullName = [user?.firstname, user?.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

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
      showcase: showcaseCategories.includes(work.category || ""),
    })),
  };
};

export const createArtistProfileRecord = async ({
  username,
  bio,
  genres,
  social_links,
}) => {
  const status = await checkUserArtistRoleAndProfile(username);

  if (!status.user) throw makeError("User not found.", 404);

  if (!status.isArtist) {
    throw makeError("Only users with artist role can create an artist portfolio.", 403);
  }

  if (status.hasArtistProfile) {
    throw makeError("Artist portfolio already exists for this user.", 409);
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

  return data;
};

export const updateArtistProfileRecord = async ({
  username,
  bio,
  genres,
  social_links,
}) => {
  const status = await checkUserArtistRoleAndProfile(username);

  if (!status.user) throw makeError("User not found.", 404);

  if (!status.isArtist) {
    throw makeError("Only artist users can update artist portfolios.", 403);
  }

  if (!status.hasArtistProfile) {
    throw makeError("Artist portfolio does not exist yet. Create it first.", 404);
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

  return data;
};

export const updateArtistCoverImageRecord = async ({
  username,
  requesting_username,
  avatar_url,
}) => {
  if (username.toLowerCase() !== requesting_username.toLowerCase()) {
    throw makeError("You can only update your own cover picture.", 403);
  }

  const { data: user, error: userError } = await supabase
    .from("user")
    .select("id, username")
    .eq("username", username)
    .maybeSingle();

  if (userError) throw userError;
  if (!user) throw makeError("User not found.", 404);

  const { data, error } = await supabase
    .from("user")
    .update({ avatar_url })
    .eq("username", username)
    .select("id, username, avatar_url")
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

export const updateArtistMedia = async ({
  media_id,
  username,
  title,
  category,
  media_url,
}) => {
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

  if (existing) {
    return {
      alreadyFollowed: true,
      data: existing,
    };
  }

  const { data, error } = await supabase
    .from("followers")
    .insert([{ follower_username, followed_username }])
    .select()
    .single();

  if (error) throw error;

  return {
    alreadyFollowed: false,
    data,
  };
};