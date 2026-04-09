import { Link } from "react-router-dom";

type Artwork = {
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

type ArtworkCardProps = {
  artwork: Artwork;
};

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      <img
        src={artwork.image}
        alt={artwork.title}
        className="w-full h-64 object-cover"
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {artwork.title}
          </h3>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
            {artwork.category}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          by{" "}
          <Link
            to={`/artists/${artwork.artistId}`}
            className="text-blue-600 underline"
          >
            {artwork.artistName}
          </Link>{" "}
          • {artwork.artistCity}
        </p>

        <p className="text-sm text-gray-700 mt-3 leading-6">
          {artwork.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <a
            href={artwork.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            Open Work
          </a>

          <Link
            to={`/artists/${artwork.artistId}`}
            className="text-sm text-gray-800 font-medium"
          >
            View Artist
          </Link>
        </div>
      </div>
    </div>
  );
}