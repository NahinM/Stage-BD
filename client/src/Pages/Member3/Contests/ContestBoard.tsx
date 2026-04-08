import React, { useState, useEffect } from 'react';
import { getContests, getContestDetails, castVote, submitContestEntry } from '../api.ts';
import { Trophy, Star, ChevronRight } from 'lucide-react';

export default function ContestBoard() {
    const [contests, setContests] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [entries, setEntries] = useState<any[]>([]);
    const [newEntryLink, setNewEntryLink] = useState('');
    
    const loggedInUser = "testuser";

    useEffect(() => {
        getContests().then(res => setContests(res.list)).catch(console.error);
    }, []);

    const selectContest = async (id: number) => {
        try {
            const res = await getContestDetails(id);
            setSelected(res.contest);
            setEntries(res.entries);
        } catch(err) { console.error(err) }
    };

    const handleVote = async (entry_id: number) => {
        try {
            await castVote({ entry_id, contest_id: selected.contest_id, username: loggedInUser });
            alert("Vote recorded successfully!");
            selectContest(selected.contest_id); 
        } catch(err: any) {
            alert(err.response?.data?.error || "You likely already voted.");
        }
    }

    const handleSubmit = async () => {
        if(!newEntryLink) return;
        try {
            await submitContestEntry({ contest_id: selected.contest_id, username: loggedInUser, media_url: newEntryLink, text_description: "My Submission" });
            alert("Entry submitted!");
            setNewEntryLink('');
            selectContest(selected.contest_id); 
        } catch(err:any) {
             alert(err.response?.data?.error || "Error submitting.");
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-7xl mx-auto flex gap-8">
                
                <div className="w-1/3 space-y-4">
                    <h2 className="text-2xl font-black text-gray-800 border-b pb-2 flex items-center"><Trophy className="mr-2 text-yellow-500" /> Live Contests</h2>
                    {contests.map((c) => (
                        <div key={c.contest_id} onClick={() => selectContest(c.contest_id)} className={`p-4 rounded-xl cursor-pointer border-2 transition ${selected?.contest_id === c.contest_id ? 'border-amber-500 bg-amber-50' : 'border-transparent bg-white hover:border-gray-200'}`}>
                            <h3 className="font-bold text-lg">{c.title}</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Ends: {new Date(c.voting_end_date).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>

                
                <div className="w-2/3 bg-white rounded-3xl shadow-xl p-8 border">
                    {!selected ? (
                        <div className="h-full flex items-center justify-center text-gray-400 italic">Select a contest from the leaderboard.</div>
                    ) : (
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-4">{selected.title}</h1>
                            <p className="text-lg text-gray-600 bg-gray-50 p-6 rounded-xl border mb-8">{selected.rules}</p>
                            
                            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Top Submissions</h2>
                            <div className="space-y-4 mb-8">
                                {entries.map((ent, idx) => (
                                    <div key={ent.entry_id} className="flex items-center bg-gray-50 border rounded-xl p-4">
                                        <div className="w-12 h-12 bg-gray-200 text-gray-500 font-bold text-xl rounded-full flex items-center justify-center mr-4">#{idx + 1}</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800">{ent.username}</h4>
                                            <a href={ent.media_url} target="_blank" className="text-sm text-blue-500 hover:underline inline-flex items-center">View Media <ChevronRight className="w-3 h-3 ml-1" /></a>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div className="font-black text-2xl text-amber-500 flex items-center"><Star className="w-5 h-5 mr-1" fill="currentColor"/> {ent.votes}</div>
                                            <button onClick={() => handleVote(ent.entry_id)} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition shadow-md">Vote</button>
                                        </div>
                                    </div>
                                ))}
                                {entries.length === 0 && <p className="italic text-gray-500 py-4">No submissions yet.</p>}
                            </div>

                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                <h3 className="font-bold text-xl mb-2 text-blue-900">Submit Your Entry</h3>
                                <div className="flex gap-2">
                                    <input type="text" value={newEntryLink} onChange={e => setNewEntryLink(e.target.value)} placeholder="Link to your artwork URL" className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                                    <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition shadow">Submit</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
