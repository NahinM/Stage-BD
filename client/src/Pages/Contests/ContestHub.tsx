import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Trophy, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContestHub() {
    const [contests, setContests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            setLoading(true);
            try {
                const { data } = await supabase
                    .from('contest')
                    .select('*, event(title)')
                    .order('submission_end', { ascending: false });
                setContests(data || []);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-10">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-2xl">
                    <Trophy className="w-12 h-12 text-amber-500 drop-shadow-md" />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white">Community Contests</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg mt-1">Participate, vote, and win rewards.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    <span className="text-zinc-500 font-medium">Loading contests...</span>
                </div>
            ) : contests.length === 0 ? (
                <div className="text-center p-16 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
                    <div className="text-6xl mb-4 opacity-50">🏆</div>
                    <h2 className="text-2xl font-bold dark:text-white mb-2">No active contests</h2>
                    <p className="text-zinc-500">Check back later for new opportunities to shine!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {contests.map((c, i) => (
                        <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-xl group">
                            <div className="flex-1 mb-6 md:mb-0 text-center md:text-left w-full">
                                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">{c.title}</h2>
                                <p className="text-base text-zinc-500 mb-4">
                                    Connected Event: <span className="font-bold text-zinc-800 dark:text-zinc-300">{c.event?.title || 'Standalone Event'}</span>
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <span className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-rose-100 dark:border-rose-900/50">
                                        Submissions end: {new Date(c.submission_end).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <Link to={`/contests/${c.id}`} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-1 w-full md:w-auto justify-center">
                                View Contest <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
