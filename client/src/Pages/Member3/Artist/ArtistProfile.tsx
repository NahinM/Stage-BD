import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArtistProfile, toggleFollow, getFollowStats } from '../api.ts';
import { UserPlus, UserMinus, Image, PlaySquare } from 'lucide-react';

export default function ArtistProfile() {
    const { artistId } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [media, setMedia] = useState<any[]>([]);
    const [stats, setStats] = useState({ followers: 0, following: 0 });
    const [isFollowing, setIsFollowing] = useState(false);
    
    const loggedInUser = "testuser";

    useEffect(() => {
        if (!artistId) return;
        getArtistProfile(artistId).then(res => {
            setProfile(res.profile);
            setMedia(res.media);
        }).catch(err => console.error(err));
        
        getFollowStats(artistId).then(res => setStats(res)).catch(console.error);
    }, [artistId]);

    const handleFollow = async () => {
        const action = isFollowing ? 'unfollow' : 'follow';
        await toggleFollow(loggedInUser, artistId!, action);
        setIsFollowing(!isFollowing);
        setStats(prev => ({...prev, followers: prev.followers + (isFollowing ? -1 : 1)}));
    }

    if (!profile) return <div className="p-10 text-center text-gray-500">Loading artist...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-10 text-white shadow-xl mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-black mb-2">{profile.username}</h1>
                    <p className="opacity-90 max-w-xl text-lg mb-4">{profile.bio}</p>
                    <div className="flex gap-4 font-bold bg-white/20 inline-flex px-4 py-2 rounded-full">
                        <span>{stats.followers} Followers</span>
                        <span>{stats.following} Following</span>
                    </div>
                </div>
                <button onClick={handleFollow} className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold flex items-center hover:bg-gray-100 transition shadow-md">
                    {isFollowing ? <><UserMinus className="w-5 h-5 mr-2"/> Unfollow</> : <><UserPlus className="w-5 h-5 mr-2"/> Follow Artist</>}
                </button>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-gray-800">Portfolio & Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {media.map((item: any) => (
                    <div key={item.media_id} className="bg-white border p-4 rounded-xl shadow-sm">
                        {item.category === 'Video Clip' ? <PlaySquare className="w-10 h-10 text-rose-500 mb-3" /> : <Image className="w-10 h-10 text-emerald-500 mb-3" />}
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{item.category}</p>
                        <a href={item.media_url} target="_blank" className="text-indigo-600 hover:underline font-semibold block">View Original</a>
                    </div>
                ))}
                {media.length === 0 && <p className="col-span-3 text-gray-500 italic">No media uploaded yet.</p>}
            </div>
        </div>
    );
}
