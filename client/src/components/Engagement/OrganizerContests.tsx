import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../../store/User/user';
import CreateContest from './CreateContest';
import { Calendar, MapPin, Plus, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrganizerContests() {
    const { user } = useUserStore();
    const [contests, setContests] = useState<any[]>([]);
    const [showCreate, setShowCreate] = useState(false);

    const fetchContests = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/contests');
            // Filter down to just this organizer's contests
            const myContests = res.data.data.filter((c: any) => c.organizer_id === user?.id);
            setContests(myContests);
        } catch (error) {
            console.error("Failed to fetch contests", error);
        }
    }

    useEffect(() => {
        if (user?.id) fetchContests();
    }, [user?.id]);

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-12 mt-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold dark:text-white flex items-center gap-2"><Trophy className="w-6 h-6 text-indigo-500" /> My Contests</h3>
                <button 
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    {showCreate ? 'Cancel' : 'New Contest'}
                </button>
            </div>

            {showCreate && <CreateContest onCreated={() => { fetchContests(); setShowCreate(false); }} />}

            <div className="grid md:grid-cols-2 gap-4">
                {contests.length === 0 ? (
                    <div className="col-span-2 p-8 text-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500">
                        You haven't created any contests yet.
                    </div>
                ) : (
                    contests.map((contest, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-lg dark:text-white mb-2">{contest.title}</h4>
                            <div className="flex flex-col gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {contest.venue}</span>
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Ends: {new Date(contest.submission_end).toLocaleDateString()}</span>
                            </div>
                            <Link to={`/contests/${contest.id}`} className="block text-center w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold py-2 rounded-lg transition-colors">
                                View Leaderboard
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
