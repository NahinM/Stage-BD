import { useEffect, useState } from "react";
import ArtistCard from "./components/artist-card";
import { fetchArtists, type ArtistCardItem } from "../data/artist-api";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const data = await fetchArtists();
        setArtists(data);
      } catch (error) {
        console.error("Failed to load artists:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-3 text-center">
          Artist Portfolios
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Browse artists available on StageBD and view their portfolios.
        </p>

        {loading ? (
          <div className="text-center text-gray-600">Loading artists...</div>
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