import * as profileModel from "../../models/artist_hub/artist_profile.js";
import * as mediaModel from "../../models/artist_hub/media.js";

export const getArtistProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const profile = await profileModel.getProfile(username);
        const media = await mediaModel.getMediaByArtist(username);
        
        if (!profile) return res.status(404).json({ error: "Profile not found" });
        res.status(200).json({ profile, media });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const setupProfile = async (req, res) => {
     try {
         const newProfile = await profileModel.createProfile(req.body);
         res.status(200).json({ success: true, profile: newProfile });
     } catch (err) {
         res.status(400).json({ error: err.message });
     }
}

export const addMedia = async (req, res) => {
    try {
         const newMedia = await mediaModel.uploadMedia(req.body);
         res.status(200).json({ success: true, media: newMedia });
     } catch (err) {
         res.status(400).json({ error: err.message });
     }
}
