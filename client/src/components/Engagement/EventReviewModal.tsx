import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

export function EventReviewModal({ eventId }: { eventId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState("");
    const user = useUserStore((state) => state.user);
    const [isOpen, setIsOpen] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`/api/events/${eventId}/reviews`);
            setReviews(res.data.data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchReviews();
        }
    }, [isOpen, eventId]);

    const handlePostReview = async () => {
        if (!user) {
            alert("Please log in to post a review.");
            return;
        }
        if (!newReview.trim()) return;

        try {
            await _api.post(`/api/events/${eventId}/reviews`, {
                user_id: user.id,
                review: newReview,
            });
            setNewReview("");
            fetchReviews();
        } catch (error) {
            console.error("Failed to post review", error);
            alert("Failed to post review. You might need to be logged in.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <Button variant="secondary" className="w-full mt-2">See review or write review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Event Reviews</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
                    ) : (
                        reviews.map((r) => (
                            <div key={r.id} className="border-b pb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                                        {r.users?.avatar_url ? (
                                            <img src={r.users.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-400"></div>
                                        )}
                                    </div>
                                    <span className="font-semibold text-sm">{r.users?.username || "Unknown User"}</span>
                                    <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm">{r.review}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <Input
                        placeholder="write your review"
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handlePostReview();
                        }}
                    />
                    <Button onClick={handlePostReview}>Post</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
