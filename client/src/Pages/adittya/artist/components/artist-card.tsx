import { Link } from "react-router-dom";

type Artist = {
  id: string;
  name: string;
  category: string;
  city: string;
  tagline: string;
  image: string;
};

type ArtistCardProps = {
  artist: Artist;
};

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link to={`/artists/${artist.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-56 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold">{artist.name}</h2>
          <p className="text-sm text-gray-600 mt-1">{artist.category}</p>
          <p className="text-sm text-gray-500">{artist.city}</p>
          <p className="text-sm mt-2 text-gray-700">{artist.tagline}</p>
        </div>
      </div>
    </Link>
  );
}