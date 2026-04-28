import React, { useState } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase'; 

interface FollowButtonProps {
    artistId: string;
    currentUserId: string;
    initialFollowing: boolean;
    onFollowChange?: (isFollowing: boolean) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ 
    artistId, 
    currentUserId, 
    initialFollowing, 
    onFollowChange 
}) => {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        if (!currentUserId) return;
        
        setIsLoading(true);
        try {
            if (isFollowing) {
                const { error } = await supabase
                    .from('follow')
                    .delete()
                    .match({ follower_id: currentUserId, followed_id: artistId });
                if(error) throw error;
            } else {
                const { error } = await supabase
                    .from('follow')
                    .insert([{ follower_id: currentUserId, followed_id: artistId }]);
                // Ignore unique constraint error if they click fast
                if(error && error.code !== '23505') throw error;
            }
            
            const newState = !isFollowing;
            setIsFollowing(newState);
            if(onFollowChange) onFollowChange(newState);
        } catch (error) {
            console.error("Failed to follow/unfollow", error);
            // In a real app, maybe trigger a toast notification here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading || !currentUserId}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                isFollowing 
                ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/25'
            } disabled:opacity-50`}
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
             isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};
