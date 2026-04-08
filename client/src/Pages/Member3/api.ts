import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getFeed = async (username: string) => (await axios.get(`${API_URL}/feed/${username}`)).data;
export const toggleFollow = async (follower: string, followed: string, action: 'follow'|'unfollow') => (await axios.post(`${API_URL}/follow`, { follower, followed, action })).data;
export const getFollowStats = async (username: string) => (await axios.get(`${API_URL}/follow/${username}`)).data;

export const getArtistProfile = async (username: string) => (await axios.get(`${API_URL}/artist/${username}`)).data;
export const uploadMedia = async (data: any) => (await axios.post(`${API_URL}/artist/media`, data)).data;

export const getContests = async () => (await axios.get(`${API_URL}/contests`)).data;
export const getContestDetails = async (id: number) => (await axios.get(`${API_URL}/contests/${id}`)).data;
export const submitContestEntry = async (data: any) => (await axios.post(`${API_URL}/contests/entry`, data)).data;
export const castVote = async (data: any) => (await axios.post(`${API_URL}/contests/vote`, data)).data;

export const submitReview = async (data: any) => (await axios.post(`${API_URL}/reviews`, data)).data;
export const getReviews = async (eventId: number) => (await axios.get(`${API_URL}/reviews/${eventId}`)).data;
