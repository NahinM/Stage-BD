import {
  supabase,
  showcaseCategories,
  resolvePreviewImage,
  buildWorkDescription,
} from "./_utils.js";

export const listShowcaseItems = async () => {
  const { data: mediaRows, error: mediaError } = await supabase
    .from("artist_media")
    .select("media_id, username, title, category, media_url, created_at")
    .order("created_at", { ascending: false });

  if (mediaError) throw mediaError;

  const allowed = new Set(showcaseCategories);
  const filtered = (mediaRows || []).filter((m) =>
    allowed.has(m.category || "")
  );

  const usernames = [...new Set(filtered.map((m) => m.username))];

  let userMap = new Map();

  if (usernames.length > 0) {
    const { data: users, error: userError } = await supabase
      .from("user")
      .select("username, firstname, lastname, city")
      .in("username", usernames);

    if (userError) throw userError;

    userMap = new Map((users || []).map((u) => [u.username, u]));
  }

  return filtered.map((work) => {
    const user = userMap.get(work.username);
    const artistName =
      [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ||
      work.username;

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