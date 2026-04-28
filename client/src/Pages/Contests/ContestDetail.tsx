import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Upload, ArrowUp, ArrowDown, Send, Loader2, ExternalLink } from 'lucide-react';
import { useUserStore } from '../../store/User/user';
import axios from 'axios';

export default function ContestDetail() {
    const { contestId } = useParams();
    const [contest, setContest] = useState<any>(null);
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const { user } = useUserStore();
    const currentUserId = user?.id || "00000000-0000-0000-0000-000000000000";

    const fetchContestData = async () => {
        setLoading(true);
        try {
            const cRes = await axios.get(`http://localhost:3000/api/contests/${contestId}`);
            setContest(cRes.data.data);

            const res = await axios.get(`http://localhost:3000/api/contests/${contestId}/leaderboard`);
            setEntries(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch contest data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchContestData(); }, [contestId]);

    const handleVote = async (entryId: string, voteType: number) => {
        try {
            await axios.post(`http://localhost:3000/api/contests/entry/${entryId}/vote`, {
                voter_id: currentUserId,
                vote_type: voteType
            });
            fetchContestData(); // Refresh UI for accurate score
        } catch(e) {
            console.error(e);
        }
    };

    const submitEntry = async (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.target as HTMLFormElement);
        const url = fd.get("url") as string;
        const desc = fd.get("desc") as string;
        if(!url) return;

        try {
            await axios.post(`http://localhost:3000/api/contests/entry`, {
                contest_id: contestId,
                user_id: currentUserId,
                content_url: url,
                description: desc
            });
            fetchContestData();
            (e.target as HTMLFormElement).reset();
        } catch(e) {
            console.error(e);
        }
    };

    if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-indigo-500" /></div>;
    if (!contest) return <div className="text-center py-32 text-2xl font-bold dark:text-white">Contest not found.</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
            <h1 className="text-5xl font-black mb-6 text-zinc-900 dark:text-white tracking-tight leading-tight">{contest.title}</h1>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 mb-10">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-widest text-sm text-indigo-600">Rules & Guidelines</h3>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-4xl text-lg leading-relaxed">{contest.rules}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Submission Form Component */}
                <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl h-fit shadow-xl sticky top-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 dark:text-white"><Upload className="w-6 h-6 text-indigo-500"/> Submit Entry</h2>
                    <form onSubmit={submitEntry} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">Media URL</label>
                            <input name="url" type="url" placeholder="https://youtube.com/..." required className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 transition-shadow outline-none dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-zinc-700 dark:text-zinc-300">Description</label>
                            <textarea name="desc" placeholder="Why should you win?" rows={4} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 transition-shadow outline-none dark:text-white resize-none" />
                        </div>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/50 mt-2">
                            <Send className="w-5 h-5"/> Submit Entry
                        </button>
                    </form>
                </div>

                {/* Leaderboard Gallery Component + Voting Widget */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <h2 className="text-3xl font-black flex items-center gap-3 mb-2 dark:text-white"><Trophy className="w-8 h-8 text-amber-400 drop-shadow-sm"/> Leaderboard</h2>
                    {entries.length === 0 && <div className="p-12 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 text-lg font-medium">No entries yet. Be the first to submit!</div>}
                    
                    {entries.map((entry, idx) => (
                        <div key={idx} className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            {/* Voting Widget Column */}
                            <div className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-800/30 w-20 sm:w-24 border-r border-zinc-100 dark:border-zinc-800">
                                <button onClick={() => handleVote(entry.id, 1)} className="p-3 hover:bg-white dark:hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-indigo-600 transition-colors shadow-sm bg-transparent hover:shadow">
                                    <ArrowUp className="w-6 h-6 md:w-8 md:h-8 font-bold" />
                                </button>
                                <span className={`font-black text-2xl md:text-3xl my-3 tracking-tighter ${entry.vote_score > 0 ? 'text-indigo-600 dark:text-indigo-400 drop-shadow-sm' : entry.vote_score < 0 ? 'text-rose-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
                                    {entry.vote_score}
                                </span>
                                <button onClick={() => handleVote(entry.id, -1)} className="p-3 hover:bg-white dark:hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-rose-500 transition-colors shadow-sm bg-transparent hover:shadow">
                                    <ArrowDown className="w-6 h-6 md:w-8 md:h-8 font-bold" />
                                </button>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6 md:p-8 flex-1 break-words overflow-hidden flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src={entry.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.user?.username}`} className="w-10 h-10 rounded-full border-2 border-indigo-100 bg-white object-cover" alt="avatar" />
                                    <span className="font-bold text-lg dark:text-white">{entry.user?.firstname} <span className="text-zinc-500 font-normal text-base">@{entry.user?.username}</span></span>
                                    {idx === 0 && entry.vote_score > 0 && <span className="ml-auto bg-gradient-to-r from-amber-200 to-amber-100 dark:from-amber-900/50 dark:to-amber-800/30 text-amber-800 dark:text-amber-400 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-amber-300 dark:border-amber-700/50 shadow-sm"><Trophy className="w-3.5 h-3.5"/> 1st Place</span>}
                                </div>
                                <a href={entry.content_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 hover:underline font-bold break-all mb-4 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg w-fit transition-colors"><ExternalLink className="w-4 h-4"/> {entry.content_url}</a>
                                <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed">{entry.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
