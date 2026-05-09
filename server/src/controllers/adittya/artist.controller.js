import * as artistModel from "../../models/adittya/artist.js";
import { handleError } from "./_utils.js";

export const getArtists = async (req, res) => {
  try {
    const data = await artistModel.listArtists();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to load artists.");
  }
};

export const getArtistDetails = async (req, res) => {
  try {
    const { username } = req.params;

    const data = await artistModel.getArtistByUsername(username);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Artist not found.",
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return handleError(res, error, "Failed to load artist details.");
  }
};

export const getArtistProfileStatus = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "username is required.",
      });
    }

    const data = await artistModel.checkUserArtistRoleAndProfile(username);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to check artist profile status.");
  }
};

export const createArtistProfile = async (req, res) => {
  try {
    const { username, bio, genres, social_links } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "username is required.",
      });
    }

    const data = await artistModel.createArtistProfileRecord({
      username,
      bio,
      genres,
      social_links,
    });

    return res.status(201).json({
      success: true,
      message: "Artist portfolio created successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to create artist portfolio.");
  }
};

export const saveArtistProfile = async (req, res) => {
  try {
    const { username, bio, genres, social_links } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "username is required.",
      });
    }

    const data = await artistModel.updateArtistProfileRecord({
      username,
      bio,
      genres,
      social_links,
    });

    return res.status(200).json({
      success: true,
      message: "Artist profile updated successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to save artist profile.");
  }
};

export const updateArtistCoverImage = async (req, res) => {
  try {
    const { username, requesting_username, avatar_url } = req.body;

    if (!username || !requesting_username || !avatar_url) {
      return res.status(400).json({
        success: false,
        message: "username, requesting_username, and avatar_url are required.",
      });
    }

    const data = await artistModel.updateArtistCoverImageRecord({
      username,
      requesting_username,
      avatar_url,
    });

    return res.status(200).json({
      success: true,
      message: "Cover picture updated successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update cover picture.");
  }
};

export const createArtistMedia = async (req, res) => {
  try {
    const { username, title, category, media_url } = req.body;

    if (!username || !title || !media_url) {
      return res.status(400).json({
        success: false,
        message: "username, title, and media_url are required.",
      });
    }

    const data = await artistModel.addArtistMedia({
      username,
      title,
      category,
      media_url,
    });

    return res.status(201).json({
      success: true,
      message: "Artist media created successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to create artist media.");
  }
};

export const editArtistMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { username, title, category, media_url } = req.body;

    if (!username || !mediaId) {
      return res.status(400).json({
        success: false,
        message: "username and mediaId are required.",
      });
    }

    const data = await artistModel.updateArtistMedia({
      media_id: mediaId,
      username,
      title,
      category,
      media_url,
    });

    return res.status(200).json({
      success: true,
      message: "Artist media updated successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update artist media.");
  }
};

export const createFollow = async (req, res) => {
  try {
    const { follower_username, followed_username } = req.body;

    if (!follower_username || !followed_username) {
      return res.status(400).json({
        success: false,
        message: "follower_username and followed_username are required.",
      });
    }

    const data = await artistModel.followArtist({
      follower_username,
      followed_username,
    });

    return res.status(200).json({
      success: true,
      message: data.alreadyFollowed
        ? "Already following this artist."
        : "Follow created successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to follow artist.");
  }
};