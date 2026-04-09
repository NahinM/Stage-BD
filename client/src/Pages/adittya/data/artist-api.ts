import axios from "axios";
import { staticArtists, staticShowcaseArtworks, type Artist } from "./artists-data";

export type ArtistCardItem = {
  id: string;
  username: string;
  name: string;
  category: string;
  city: string;
  bio: string;
  genres: string;
  image: string;
  tagline: string;
  socialLinks?: Record<string, string>;
};

export type WorkItem = {
  id: number;
  title: string;
  type: string;
  category: string;
  description: string;
  link: string;
  image: string;
  showcase: boolean;
};

export type ArtistDetail = ArtistCardItem & {
  works: WorkItem[];
};

export type ShowcaseItem = {
  id: number;
  title: string;
  type: string;
  category: string;
  description: string;
  link: string;
  image: string;
  artistId: string;
  artistName: string;
  artistCity: string;
};

const normalizeStaticArtist = (artist: Artist): ArtistDetail => ({
  id: artist.id,
  username: artist.username,
  name: artist.name,
  category: artist.category,
  city: artist.city,
  bio: artist.bio,
  genres: artist.genres,
  image: artist.image,
  tagline: artist.tagline,
  socialLinks: artist.socialLinks || {},
  works: artist.works,
});

export const fetchArtists = async (): Promise<ArtistCardItem[]> => {
  try {
    const { data } = await axios.get("/api/adittya/artists");
    const dbArtists = data.artists || [];

    const merged = [...staticArtists.map(normalizeStaticArtist), ...dbArtists];

    const uniqueMap = new Map<string, ArtistCardItem>();
    merged.forEach((artist) => {
      if (!uniqueMap.has(artist.id)) {
        uniqueMap.set(artist.id, artist);
      }
    });

    return Array.from(uniqueMap.values());
  } catch (error) {
    console.error("Falling back to static artists:", error);
    return staticArtists.map(normalizeStaticArtist);
  }
};

export const fetchArtistDetails = async (username: string): Promise<ArtistDetail> => {
  const staticArtist = staticArtists.find(
    (artist) => artist.id === username || artist.username === username
  );

  try {
    const { data } = await axios.get(`/api/adittya/artists/${username}`);
    const dbArtist = data.artist;

    if (!staticArtist) return dbArtist;

    return {
      ...normalizeStaticArtist(staticArtist),
      ...dbArtist,
      works: [...normalizeStaticArtist(staticArtist).works, ...(dbArtist.works || [])],
    };
  } catch (error) {
    console.error("Falling back to static artist details:", error);

    if (staticArtist) {
      return normalizeStaticArtist(staticArtist);
    }

    throw error;
  }
};

export const fetchShowcaseItems = async (): Promise<ShowcaseItem[]> => {
  try {
    const { data } = await axios.get("/api/adittya/showcase");
    const dbItems = data.items || [];

    const merged = [...staticShowcaseArtworks, ...dbItems];

    const uniqueMap = new Map<number, ShowcaseItem>();
    merged.forEach((item) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    return Array.from(uniqueMap.values());
  } catch (error) {
    console.error("Falling back to static showcase:", error);
    return staticShowcaseArtworks;
  }
};

export const saveArtistProfile = async (payload: {
  username: string;
  bio: string;
  genres: string;
  social_links: Record<string, string>;
}) => {
  const { data } = await axios.post("/api/adittya/profile", payload);
  return data;
};

export const addArtistWork = async (payload: {
  username: string;
  title: string;
  category: string;
  media_url: string;
}) => {
  const { data } = await axios.post("/api/adittya/media", payload);
  return data;
};

export const updateArtistWork = async (
  mediaId: number,
  payload: {
    username: string;
    title: string;
    category: string;
    media_url: string;
  }
) => {
  const { data } = await axios.put(`/api/adittya/media/${mediaId}`, payload);
  return data;
};

export const followArtist = async (payload: {
  follower_username: string;
  followed_username: string;
}) => {
  const { data } = await axios.post("/api/adittya/follow", payload);
  return data;
};