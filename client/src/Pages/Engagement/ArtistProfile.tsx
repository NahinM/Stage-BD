import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FollowButton } from '../../components/Engagement/FollowButton';
import { MapPin, Calendar, Users, Loader2, ArrowBigUp, ArrowBigDown } from 'lucide-react';

export default function ArtistProfile() {
    const { artistId } = useParams<{ artistId: string }>();
    const [artist, setArtist] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [followerCount, setFollowerCount] = useState(0);
    const [voteScore, setVoteScore] = useState(0);
    const [userVote, setUserVote] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // In a real app, this comes from an Auth Context!
    const currentUserId = "00000000-0000-0000-0000-000000000000";

    useEffect(() => {
        const fetchArtistData = async () => {
            if (!artistId) return;
            setLoading(true);

            try {
                // Fetch basic user profile
                const { data: userData } = await supabase
                    .from('user')
                    .select('id, username, firstname, lastname, avatar_url, bio, city')
                    .eq('id', artistId)
                    .single();

                setArtist(userData);

                // Fetch follower count
                const { count } = await supabase.from('follow').select('id', { count: 'exact', head: true }).eq('followed_id', artistId);
                setFollowerCount(count || 0);

                // Fetch their upcoming events
                const { data: eventsData } = await supabase
                    .from('event_artist')
                    .select('event!inner(*, venue(name, city))')
                    .eq('artist_id', artistId);

                if (eventsData) {
                    setEvents(eventsData.map(e => e.event));
                }

                // Fetch Artist Vote Score
                try {
                    const scoreRes = await fetch(`http://localhost:3000/api/artist/${artistId}/score`);
                    if (scoreRes.ok) {
                        const { score } = await scoreRes.json();
                        setVoteScore(score || 0);
                    }
                } catch (e) { console.error("Could not fetch score"); }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtistData();
    }, [artistId]);

    const handleVote = async (type: 1 | -1) => {
        if (userVote === type) return;
        const prevVote = userVote;
        setUserVote(type);
        setVoteScore(prev => prev + (type === 1 ? (prevVote === -1 ? 2 : 1) : (prevVote === 1 ? -2 : -1)));

        try {
            await fetch(`http://localhost:3000/api/artist/${artistId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ voter_id: currentUserId, vote_type: type })
            });
        } catch {
            setUserVote(prevVote); // rollback on fail
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;
    if (!artist) return <div className="text-center mt-20 text-xl font-semibold">Artist not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 p-8 shadow-2xl text-white flex flex-col md:flex-row items-center gap-8">
                <img
                    src={artist.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + artist.username}
                    alt={artist.username}
                    className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white/20 shadow-lg object-cover bg-white"
                />
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                        {artist.firstname} {artist.lastname}
                    </h1>
                    <p className="text-indigo-200 text-lg mb-4">@{artist.username}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6 text-sm font-medium text-indigo-100">
                        {artist.city && (
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                                <MapPin className="w-4 h-4" /> {artist.city}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                            <Users className="w-4 h-4" /> {followerCount} Followers
                        </span>
                    </div>

                    <div className="flex justify-center md:justify-start gap-3">
                        <FollowButton
                            artistId={artist.id}
                            currentUserId={currentUserId}
                            initialFollowing={false}
                            onFollowChange={(isFollowing) => setFollowerCount(prev => isFollowing ? prev + 1 : prev - 1)}
                        />

                        {/* Reddit-Style Artist Voting Cluster */}
                        <div className="flex items-center bg-white/10 rounded-full px-2 py-1">
                            <button
                                onClick={() => handleVote(1)}
                                className={`p-1 rounded-full transition-colors ${userVote === 1 ? 'text-green-400 bg-white/20' : 'text-slate-300 hover:bg-white/20 hover:text-green-300'}`}
                            >
                                <ArrowBigUp className="w-6 h-6" />
                            </button>
                            <span className="font-bold text-lg px-2 min-w-[2rem] text-center">
                                {voteScore}
                            </span>
                            <button
                                onClick={() => handleVote(-1)}
                                className={`p-1 rounded-full transition-colors ${userVote === -1 ? 'text-red-400 bg-white/20' : 'text-slate-300 hover:bg-white/20 hover:text-red-300'}`}
                            >
                                <ArrowBigDown className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="mt-12 bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
                <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">About {artist.firstname}</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                    {artist.bio || "This artist hasn't added a bio yet."}
                </p>
            </div>

            {/* Upcoming Events */}
            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6 text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                    <Calendar className="w-8 h-8 text-indigo-500" />
                    Upcoming Events
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {events.length === 0 ? (
                        <p className="text-zinc-500 italic col-span-2">No upcoming events found.</p>
                    ) : (
                        events.map((ev, i) => (
                            <div key={i} className="group relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/50">
                                <div className="h-48 bg-zinc-200 overflow-hidden">
                                    <img src={ev.poster_url || `https://picsum.photos/400/300?random=${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="event poster" />
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-xl mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{ev.title}</h3>
                                    <p className="text-sm text-zinc-500 mb-4">{new Date(ev.event_date).toLocaleDateString()}</p>
                                    <button className="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white font-medium py-2 rounded-lg transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
