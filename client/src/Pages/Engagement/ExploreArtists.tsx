import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, MapPin, Star, Loader2 } from 'lucide-react';
import Nav from '../../components/nav';

export default function ExploreArtists() {
    const [artists, setArtists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:3000/api/artists/explore');
                setArtists(res.data.data || []);
            } catch (e) {
                console.error("Failed to fetch artists", e);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-20">
            <Nav />
            <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold flex items-center gap-3 text-zinc-900 dark:text-white">
                            <Users className="w-10 h-10 text-indigo-500 drop-shadow-md" />
                            Explore Artists
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Discover new talent, follow your favorites, and show some love.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 space-y-4">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <span className="text-zinc-500 font-medium">Loading artists...</span>
                    </div>
                ) : artists.length === 0 ? (
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 shadow-inner">
                        <span className="text-6xl mb-4 block animate-bounce">🎭</span>
                        <h2 className="text-2xl font-bold mb-2 dark:text-white">No artists found</h2>
                        <p className="text-zinc-500">Check back later when more artists join!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {artists.map((artist, idx) => (
                            <Link to={`/artist/${artist.id}`} key={idx} className="group block bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800 hover:-translate-y-2">
                                <div className="relative h-48 bg-zinc-200 overflow-hidden">
                                    <img 
                                        src={artist.avatar_url || `https://ui-avatars.com/api/?name=${artist.username}&background=random&size=256`} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        alt={`${artist.username} avatar`} 
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-amber-500 font-bold px-3 py-1 rounded-full shadow-lg text-sm flex items-center gap-1 border border-white/50 dark:border-zinc-700">
                                        <Star className="w-4 h-4 fill-amber-500" /> {artist.total_like || 0}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col items-center text-center">
                                    <h3 className="text-xl font-bold mb-1 text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                        {artist.firstname && artist.lastname ? `${artist.firstname} ${artist.lastname}` : artist.username}
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-3">@{artist.username}</p>
                                    
                                    {artist.city && (
                                        <div className="flex items-center gap-1 text-zinc-400 text-xs uppercase tracking-widest font-bold mb-4">
                                            <MapPin className="w-3 h-3" /> {artist.city}
                                        </div>
                                    )}
                                    
                                    <div className="mt-auto w-full pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                        <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm w-full py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            View Profile
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
