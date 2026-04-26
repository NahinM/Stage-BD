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
  id: string | number;
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
  id: string | number;
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

const dedupeWorks = (works: WorkItem[]): WorkItem[] => {
  const uniqueMap = new Map<string, WorkItem>();

  works.forEach((work) => {
    const key = String(work.id);
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, work);
    }
  });

  return Array.from(uniqueMap.values());
};

export const fetchArtists = async (): Promise<ArtistCardItem[]> => {
  try {
    const { data } = await axios.get("/api/adittya/artists");
    const dbArtists = data.data || [];

    const merged = [...staticArtists.map(normalizeStaticArtist), ...dbArtists];

    const uniqueMap = new Map<string, ArtistCardItem>();
    merged.forEach((artist) => {
      const key = artist.username || artist.id;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, artist);
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
    const dbArtist = data.data;

    if (!dbArtist && staticArtist) {
      return normalizeStaticArtist(staticArtist);
    }

    if (!staticArtist) {
      return {
        ...dbArtist,
        works: dedupeWorks(dbArtist.works || []),
      };
    }

    const normalizedStatic = normalizeStaticArtist(staticArtist);

    return {
      ...normalizedStatic,
      ...dbArtist,
      socialLinks: {
        ...(normalizedStatic.socialLinks || {}),
        ...(dbArtist.socialLinks || {}),
      },
      works: dedupeWorks([
        ...normalizedStatic.works,
        ...(dbArtist.works || []),
      ]),
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
    const dbItems = data.data || [];

    const merged = [...staticShowcaseArtworks, ...dbItems];

    const uniqueMap = new Map<string, ShowcaseItem>();
    merged.forEach((item) => {
      const key = String(item.id);
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
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
  mediaId: string | number,
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