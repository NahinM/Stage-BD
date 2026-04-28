import { useEffect, useState } from 'react';
import { Sparkles, Calendar, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useUserStore } from '../../store/User/user';

export default function RecommendationsFeed() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useUserStore();
    const currentUserId = user?.id || "00000000-0000-0000-0000-000000000000";

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                // Fetch curated events from our Smart Recommendations Backend Engine
                const res = await axios.get(`http://localhost:3000/api/recommendations/${currentUserId}`);
                setEvents(res.data.data || []);
            } catch (e) {
                console.error("Failed to fetch recommendations", e);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [currentUserId]);

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold flex items-center gap-3 text-zinc-900 dark:text-white">
                        <Sparkles className="w-10 h-10 text-amber-400 drop-shadow-md" />
                        For You
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Curated events based on your follows, city, and history.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center h-64 space-y-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <span className="text-zinc-500 font-medium">Crunching the algorithm...</span>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 shadow-inner">
                    <span className="text-6xl mb-4 block animate-bounce">🤔</span>
                    <h2 className="text-2xl font-bold mb-2 dark:text-white">No recommendations yet</h2>
                    <p className="text-zinc-500">Go follow some artists or update your preferences to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, idx) => (
                        <div key={idx} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-100 dark:border-zinc-800 hover:-translate-y-2">
                            <div className="relative h-60 bg-zinc-200 overflow-hidden">
                                <img src={event.poster_url || `https://picsum.photos/400/300?random=${event.id}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="event poster" />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-indigo-900 dark:text-indigo-100 font-bold px-4 py-1.5 rounded-full shadow-lg text-sm flex items-center gap-2 border border-white/50 dark:border-zinc-700">
                                    MATCH <span className="text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 w-7 h-7 rounded-full flex items-center justify-center font-black">{event.score}</span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-3">
                                    <span className="uppercase tracking-wider">{event.event_category?.name || "Music"}</span>
                                    <span className="text-zinc-300 dark:text-zinc-600">•</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.venue?.city || "Local"}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 line-clamp-2 text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">
                                    {event.title}
                                </h3>

                                <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                        <Calendar className="w-5 h-5 text-indigo-500" />
                                        <span className="font-semibold">{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <button className="bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-900/30 dark:border-indigo-500/30 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white dark:hover:border-indigo-600 px-6 py-2.5 rounded-xl transition-all font-bold shadow-sm hover:shadow-md">
                                        Tickets
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
