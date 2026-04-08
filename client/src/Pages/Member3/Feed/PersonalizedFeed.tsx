import React, { useState, useEffect } from 'react';
import { getFeed } from '../api.ts';
import { Calendar, MapPin } from 'lucide-react';

export default function PersonalizedFeed() {
    const [events, setEvents] = useState<any[]>([]);
    const username = "testuser"; // mocked auth

    useEffect(() => {
        getFeed(username).then(res => setEvents(res.events || [])).catch(console.error);
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black mb-8 text-slate-800">For You</h1>
                <div className="grid gap-6">
                    {events.map((ev: any) => (
                        <div key={ev.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{ev.title}</h2>
                            <p className="text-gray-600 mb-4">{ev.description}</p>
                            <div className="flex gap-4 text-sm font-semibold text-gray-500">
                                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {new Date(ev.event_date).toLocaleDateString()}</span>
                                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> Venue ID: {ev.venue_id}</span>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && <p className="text-gray-500">No events found in your feed.</p>}
                </div>
            </div>
        </div>
    );
}
