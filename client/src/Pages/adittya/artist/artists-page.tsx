import { useEffect, useState } from "react";
import ArtistCard from "./components/artist-card";
import {
  createMyArtistPortfolio,
  fetchArtistProfileStatus,
  fetchArtists,
  type ArtistCardItem,
  type ArtistProfileStatus,
} from "../data/artist-api";
import { refreshUserIfNeeded, useUserStore } from "@/store/User/user";

export default function ArtistsPage() {
  const user = useUserStore((state) => state.user);

  const [artists, setArtists] = useState<ArtistCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] =
    useState<ArtistProfileStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [userLoading, setUserLoading] = useState(true);

  const username = user?.username || "";

  const loadArtists = async () => {
    try {
      setLoading(true);
      const data = await fetchArtists();
      setArtists(data);
    } catch (error) {
      console.error("Failed to load artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLoggedInUser = async () => {
    try {
      setUserLoading(true);
      await refreshUserIfNeeded();
    } catch (error) {
      console.error("Failed to refresh logged-in user:", error);
    } finally {
      setUserLoading(false);
    }
  };

  const loadProfileStatus = async () => {
    if (!username) {
      setProfileStatus(null);
      return;
    }

    try {
      setStatusLoading(true);
      const data = await fetchArtistProfileStatus(username);
      setProfileStatus(data);
    } catch (error) {
      console.error("Failed to load artist profile status:", error);
      setProfileStatus(null);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
    loadLoggedInUser();
  }, []);

  useEffect(() => {
    loadProfileStatus();
  }, [username]);

  const handleCreatePortfolio = async () => {
    if (!username) {
      setMessage("Please sign in first.");
      return;
    }

    try {
      setCreatingProfile(true);
      setMessage("");

      await createMyArtistPortfolio({
        username,
        bio: user?.bio || "",
        genres: "",
        social_links: {},
      });

      setMessage("Artist portfolio created successfully.");
      await loadArtists();
      await loadProfileStatus();
    } catch (error: any) {
      console.error("Failed to create artist portfolio:", error);
      setMessage(
        error?.response?.data?.message ||
          "Failed to create artist portfolio."
      );
    } finally {
      setCreatingProfile(false);
    }
  };

  const backendSaysArtist = profileStatus?.isArtist === true;
  const hasPortfolio = profileStatus?.hasArtistProfile === true;

  const canCreatePortfolio = !!username && backendSaysArtist && !hasPortfolio;
  const alreadyHasPortfolio = !!username && backendSaysArtist && hasPortfolio;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-3 text-center">
          Artist Portfolios
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Browse artists available on StageBD and view their portfolios.
        </p>

        <div className="mb-8 flex flex-col items-center gap-3">
          {userLoading ? (
            <p className="text-sm text-gray-600">
              Checking signed-in user...
            </p>
          ) : !username ? (
            <p className="rounded-xl bg-white px-5 py-2 text-sm text-gray-700 shadow-sm">
              Sign in as an artist to create your own portfolio.
            </p>
          ) : statusLoading ? (
            <p className="text-sm text-gray-600">
              Checking artist profile status for {username}...
            </p>
          ) : canCreatePortfolio ? (
            <button
              onClick={handleCreatePortfolio}
              disabled={creatingProfile}
              className="rounded-xl bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {creatingProfile
                ? "Creating Portfolio..."
                : "Create My Artist Portfolio"}
            </button>
          ) : alreadyHasPortfolio ? (
            <p className="rounded-xl bg-white px-5 py-2 text-sm text-gray-700 shadow-sm">
              Your artist portfolio already exists.
            </p>
          ) : (
            <p className="rounded-xl bg-white px-5 py-2 text-sm text-gray-700 shadow-sm">
              Your account is signed in, but it does not have artist permission.
            </p>
          )}

          {username && (
            <p className="text-xs text-gray-500">Signed in as: {username}</p>
          )}

          {message && (
            <p className="text-center text-sm text-gray-700">{message}</p>
          )}
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading artists...</div>
        ) : artists.length === 0 ? (
          <div className="text-center text-gray-600">
            No artist portfolios found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}