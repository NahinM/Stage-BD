import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import _api from "@/authentication/private-api";
import { useUserStore } from "@/store/User/user";
import axios from "axios";

interface Review {
    id: string;
    review: string;
    created_at: string;
    users?: {
        username: string;
        avatar_url: string;
    };
}

export function EventReviews({ eventId }: { eventId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState("");
    const user = useUserStore((state) => state.user);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`/api/events/${eventId}/reviews`);
            setReviews(res.data.data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [eventId]);

    const handlePostReview = async () => {
        if (!user) {
            alert("Please log in to post a review.");
            return;
        }
        if (!newReview.trim()) return;

        try {
            await _api.post(`/events/${eventId}/reviews`, {
                user_id: user.id,
                review: newReview,
            });
            setNewReview("");
            fetchReviews();
        } catch (error: any) {
            console.error("Failed to post review", error);
            const msg = error.response?.data?.message || "Failed to post review. You might need to be logged in.";
            alert(msg);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
                ) : (
                    reviews.map((r) => (
                        <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                                    {r.users?.avatar_url ? (
                                        <img src={r.users.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-400"></div>
                                    )}
                                </div>
                                <span className="font-semibold text-slate-900">{r.users?.username || "Unknown User"}</span>
                                <span className="text-xs text-slate-500">{new Date(r.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-700">{r.review}</p>
                        </div>
                    ))
                )}
            </div>
            <div className="flex items-center gap-2 mt-4">
                <Input 
                    placeholder="Write your review..." 
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePostReview();
                    }}
                    className="flex-1"
                />
                <Button onClick={handlePostReview} className="bg-teal-700 hover:bg-teal-800 text-white">Post</Button>
            </div>
        </div>
    );
}
