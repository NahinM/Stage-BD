import React, { useState, useEffect } from 'react';
import { getReviews, submitReview } from '../api.ts';
import { Star } from 'lucide-react';

export default function ReviewWidget({ eventId }: { eventId: number }) {
    const [reviews, setReviews] = useState<any[]>([]);
    const [average, setAverage] = useState(0);
    const [newRating, setNewRating] = useState(5);
    const [newText, setNewText] = useState('');
    
    const loggedInUser = "testuser";

    useEffect(() => {
        if (!eventId) return;
        fetchReviews();
    }, [eventId]);

    const fetchReviews = async () => {
         try {
             const res = await getReviews(eventId);
             setReviews(res.reviews || []);
             setAverage(res.averageRating || 0);
         } catch(err) { console.error(err) }
    }

    const handleSubmit = async () => {
        try {
            await submitReview({ event_id: eventId, username: loggedInUser, rating: newRating, review_text: newText });
            setNewText('');
            setNewRating(5);
            fetchReviews();
        } catch(err: any) {
             alert(err.response?.data?.error || "Error adding review.");
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-2xl font-bold mb-2">Event Reviews</h3>
            <div className="flex items-center mb-6">
                <Star className="w-8 h-8 text-yellow-400 mr-2" fill="currentColor" />
                <span className="text-3xl font-black text-gray-800">{average.toFixed(1)}</span>
                <span className="text-gray-500 ml-2">({reviews.length} reviews)</span>
            </div>

            <div className="space-y-4 mb-8 max-h-64 overflow-y-auto">
                {reviews.map(r => (
                    <div key={r.review_id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-bold text-gray-800">{r.username}</span>
                           <div className="flex">{Array.from({length: r.rating}).map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor"/>)}</div>
                        </div>
                        <p className="text-gray-600 text-sm">{r.review_text}</p>
                    </div>
                ))}
            </div>

            <div className="border-t pt-6">
                <h4 className="font-bold mb-3">Leave a Review</h4>
                <div className="flex gap-2 mb-3">
                   {Array.from({length: 5}).map((_, i) => (
                       <Star key={i} onClick={() => setNewRating(i+1)} className={`w-6 h-6 cursor-pointer ${newRating > i ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                   ))}
                </div>
                <textarea value={newText} onChange={e => setNewText(e.target.value)} rows={3} placeholder="What did you think of the event?" className="w-full p-3 border rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                <button onClick={handleSubmit} className="bg-blue-600 font-bold text-white px-6 py-2 rounded-xl shadow w-full hover:bg-blue-700">Submit Review</button>
            </div>
        </div>
    )
}
