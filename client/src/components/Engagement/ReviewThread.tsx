import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';

export interface Review {
    id: string;
    parent_id: string | null;
    reviewer_id: string;
    rating: number | null;
    review_text: string;
    vote_score: number;
    user: { username: string; avatar_url: string; firstname: string };
    created_at: string;
    replies?: Review[];
}

interface ReviewThreadProps {
    review: Review;
    currentUserId: string;
    eventId: string;
    onReplySubmitted: () => void;
}

export const ReviewThread: React.FC<ReviewThreadProps> = ({ review, currentUserId, eventId, onReplySubmitted }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [localScore, setLocalScore] = useState(review.vote_score || 0);

    const handleVote = async (voteType: number) => {
        // Optimistic UI update
        setLocalScore(prev => prev + voteType); 
        try {
            const res = await fetch(`http://localhost:3000/api/reviews/${review.id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ voter_id: currentUserId, vote_type: voteType })
            });
            if(!res.ok) {
                // Revert on error
                setLocalScore(prev => prev - voteType);
                alert("Failed to cast vote. You might have already voted.");
            }
        } catch (e) {
            console.error(e);
            setLocalScore(prev => prev - voteType);
        }
    };

    const submitReply = async () => {
        if (!replyText.trim()) return;
        try {
            const res = await fetch(`http://localhost:3000/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_id: eventId,
                    reviewer_id: currentUserId,
                    parent_id: review.id,
                    review_text: replyText
                })
            });
            if (res.ok) {
                setReplyText("");
                setIsReplying(false);
                onReplySubmitted(); // Trigger parent to refetch data
            } else {
                const data = await res.json();
                alert(data.message || "Failed to reply. Max limit reached or event not attended.");
            }
        } catch(e) {
            console.error("Reply error:", e);
        }
    };

    return (
        <div className="flex flex-col mb-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-shadow hover:shadow-md">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <img 
                    src={review.user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.username}`} 
                    className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover" 
                    alt="avatar" 
                />
                <div className="flex flex-col">
                    <span className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
                        {review.user?.firstname} <span className="text-zinc-500 font-normal">@{review.user?.username}</span>
                    </span>
                    <span className="text-xs text-zinc-400">
                        {new Date(review.created_at).toLocaleDateString()}
                    </span>
                </div>
                {review.rating !== null && review.rating !== undefined && (
                    <div className="ml-auto flex gap-1 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-base leading-none ${i < review.rating! ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`}>★</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <p className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base leading-relaxed mb-5 whitespace-pre-wrap">
                {review.review_text}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 text-zinc-500 font-medium text-sm">
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 shadow-inner">
                    <button onClick={() => handleVote(1)} className="hover:bg-white dark:hover:bg-zinc-700 hover:text-indigo-600 focus:outline-none p-1.5 rounded-full transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className="w-8 flex justify-center text-zinc-900 dark:text-white font-bold">{localScore}</span>
                    <button onClick={() => handleVote(-1)} className="hover:bg-white dark:hover:bg-zinc-700 hover:text-rose-500 focus:outline-none p-1.5 rounded-full transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                    </button>
                </div>
                
                <button onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors font-semibold bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full">
                    <MessageSquare className="w-4 h-4" /> Reply
                </button>
            </div>

            {/* Add Reply Area */}
            {isReplying && (
                <div className="mt-5 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <input 
                        type="text" 
                        value={replyText} 
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="What are your thoughts?"
                        className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-zinc-900 dark:text-white"
                        onKeyDown={(e) => e.key === 'Enter' && submitReply()}
                    />
                    <button onClick={submitReply} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center shadow-md">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Recursively Render Replies */}
            {review.replies && review.replies.length > 0 && (
                <div className="mt-5 pl-4 md:pl-8 border-l-2 border-indigo-100 dark:border-indigo-900/30 space-y-4">
                    {review.replies.map(reply => (
                        <ReviewThread 
                            key={reply.id} 
                            review={reply} 
                            currentUserId={currentUserId} 
                            eventId={eventId} 
                            onReplySubmitted={onReplySubmitted} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ReviewSection({ eventId }: { eventId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReviewText, setNewReviewText] = useState("");
    const [loading, setLoading] = useState(true);

    // Hardcoded for now. Switch to Auth context later.
    const currentUserId = "00000000-0000-0000-0000-000000000000";

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/reviews/event/${eventId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data.data || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchReviews();
    }, [eventId]);

    const submitTopLevelReview = async () => {
        if (!newReviewText.trim()) return;
        try {
            const res = await fetch(`http://localhost:3000/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_id: eventId,
                    reviewer_id: currentUserId,
                    parent_id: null,
                    review_text: newReviewText,
                    rating: 5 // Default rating for top level
                })
            });
            if (res.ok) {
                setNewReviewText("");
                fetchReviews();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to post review. Ensure you attended this event.");
            }
        } catch(e) {
            console.error("Review post error:", e);
        }
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="bg-white/80 dark:bg-zinc-900/80 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">Audience Reviews</h2>
            
            {/* Top Level Review Input */}
            <div className="mb-8 flex gap-3">
                <input 
                    type="text" 
                    value={newReviewText} 
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Share your experience about this event..."
                    className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && submitTopLevelReview()}
                />
                <button onClick={submitTopLevelReview} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md">
                    Post Review
                </button>
            </div>

            {/* Threads */}
            {reviews.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No reviews yet. Be the first to share!</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map(rev => (
                        <ReviewThread 
                            key={rev.id} 
                            review={rev} 
                            currentUserId={currentUserId} 
                            eventId={eventId} 
                            onReplySubmitted={fetchReviews} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
