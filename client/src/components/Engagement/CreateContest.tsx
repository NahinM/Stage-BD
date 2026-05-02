import React, { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../../store/User/user';

export default function CreateContest({ onCreated }: { onCreated: () => void }) {
    const { user } = useUserStore();
    const [title, setTitle] = useState('');
    const [venue, setVenue] = useState('');
    const [prizeTime, setPrizeTime] = useState('');
    const [rules, setRules] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate prize giving time is after submission end (+5 days)
        const fiveDaysFromNow = new Date();
        fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
        if (new Date(prizeTime) <= fiveDaysFromNow) {
            alert("Prize giving time must be after the submission deadline (which is 5 days from now).");
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/contests', {
                title, 
                venue, 
                prize_giving_time: prizeTime, 
                rules,
                organizer_id: user?.id || "00000000-0000-0000-0000-000000000000"
            });
            alert('Contest created successfully!');
            setTitle('');
            setVenue('');
            setPrizeTime('');
            setRules('');
            onCreated();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to create contest');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Create New Contest</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-1 dark:text-zinc-300">Title</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 dark:text-white" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 dark:text-zinc-300">Venue</label>
                    <input type="text" required value={venue} onChange={e => setVenue(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 dark:text-white" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 dark:text-zinc-300">Rules & Guidelines</label>
                    <textarea rows={3} required value={rules} onChange={e => setRules(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 dark:text-white resize-none" placeholder="What are the instructions for this contest?"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1 dark:text-zinc-300">Prize Giving Time (Must be after {new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString()})</label>
                    <input type="datetime-local" required value={prizeTime} onChange={e => setPrizeTime(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 dark:text-white" />
                </div>
                <button type="submit" disabled={loading} className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors">
                    {loading ? 'Creating...' : 'Create Contest'}
                </button>
            </form>
        </div>
    );
}
