import { useEffect, useMemo, useState } from "react";
import ArtworkCard from "./components/artwork-card";
import { fetchShowcaseItems, type ShowcaseItem } from "../data/artist-api";

const categories = [
  "All",
  "Digital Media",
  "Poster",
  "Performance Visual",
  "Digital Art",
  "Illustration",
  "Brand Design",
];

export default function DigitalArtShowcase() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const loadShowcase = async () => {
      try {
        const data = await fetchShowcaseItems();
        setItems(data);
      } catch (error) {
        console.error("Failed to load showcase:", error);
      } finally {
        setLoading(false);
      }
    };

    loadShowcase();
  }, []);

  const filteredArtworks = useMemo(() => {
    return items.filter((artwork) => {
      const matchesCategory =
        selectedCategory === "All" || artwork.category === selectedCategory;

      const query = searchText.trim().toLowerCase();
      const matchesSearch =
        artwork.title.toLowerCase().includes(query) ||
        artwork.artistName.toLowerCase().includes(query) ||
        artwork.artistCity.toLowerCase().includes(query) ||
        artwork.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchText]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Digital Art Showcase
          </h1>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto leading-7">
            Explore featured visual and digital media works from StageBD artists.
            Browse posters, performance visuals, and creator content in one gallery page.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <input
              type="text"
              placeholder="Search by artwork title, artist, or city"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full lg:w-96 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
            />

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading showcase...</div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Showing {filteredArtworks.length} showcase item
              {filteredArtworks.length !== 1 ? "s" : ""}
            </div>

            {filteredArtworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredArtworks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-600">
                No showcase items found for the selected filter.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}