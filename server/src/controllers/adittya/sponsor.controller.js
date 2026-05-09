import * as sponsorModel from "../../models/adittya/sponsor.js";
import { handleError } from "./_utils.js";

export const getPublicSponsorProfiles = async (req, res) => {
  try {
    const data = await sponsorModel.listPublicSponsorProfiles();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to load public sponsor profiles.");
  }
};

export const getMySponsorProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Sponsor username is required.",
      });
    }

    const data = await sponsorModel.getMySponsorProfileRecord(username);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to load sponsor profile.");
  }
};

export const upsertMySponsorProfile = async (req, res) => {
  try {
    const {
      sponsor_username,
      sponsor_name,
      sponsor_type,
      focus_areas,
      city,
      min_budget,
      max_budget,
      description,
      preferred_artists,
      is_public,
    } = req.body;

    if (!sponsor_username || !sponsor_name || !description) {
      return res.status(400).json({
        success: false,
        message: "sponsor_username, sponsor_name, and description are required.",
      });
    }

    const data = await sponsorModel.upsertMySponsorProfileRecord({
      sponsor_username,
      sponsor_name,
      sponsor_type,
      focus_areas,
      city,
      min_budget,
      max_budget,
      description,
      preferred_artists,
      is_public,
    });

    return res.status(200).json({
      success: true,
      message: "Sponsor listing saved successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to save sponsor profile.");
  }
};

export const createSponsorshipRequest = async (req, res) => {
  try {
    const {
      artist_username,
      requesting_username,
      sponsor_username,
      sponsor_name,
      message,
      requested_amount,
    } = req.body;

    if (
      !artist_username ||
      !requesting_username ||
      !sponsor_username ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "artist_username, requesting_username, sponsor_username, and message are required.",
      });
    }

    const result = await sponsorModel.createSponsorshipRequestRecord({
      artist_username,
      requesting_username,
      sponsor_username,
      sponsor_name,
      message,
      requested_amount,
    });

    return res.status(201).json({
      success: true,
      message: `Sponsorship request sent to ${result.sponsorDisplayName} successfully.`,
      data: result.data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to create sponsorship request.");
  }
};

export const getSponsorshipRequestsByArtist = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Artist username is required.",
      });
    }

    const data = await sponsorModel.getSponsorshipRequestsByArtistRecord(username);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to load sponsorship requests.");
  }
};

export const getSponsorshipRequestsForSponsor = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Sponsor username is required.",
      });
    }

    const data = await sponsorModel.getSponsorshipRequestsForSponsorRecord(username);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to load sponsor requests.");
  }
};

export const updateSponsorshipRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { sponsor_username, status } = req.body;

    if (!requestId || !sponsor_username || !status) {
      return res.status(400).json({
        success: false,
        message: "requestId, sponsor_username, and status are required.",
      });
    }

    const data = await sponsorModel.updateSponsorshipRequestStatusRecord({
      requestId,
      sponsor_username,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Sponsorship request status updated successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update sponsorship request status.");
  }
};

export const getAvailableArtistsForSponsor = async (req, res) => {
  try {
    const { sponsorUsername } = req.params;

    if (!sponsorUsername) {
      return res.status(400).json({
        success: false,
        message: "Sponsor username is required.",
      });
    }

    const data = await sponsorModel.getAvailableArtistsForSponsorRecord(
      sponsorUsername
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to load artists for sponsor.");
  }
};

export const createSponsorOffer = async (req, res) => {
  try {
    const { sponsor_username, artist_username, message, offered_amount } =
      req.body;

    if (!sponsor_username || !artist_username || !message || !offered_amount) {
      return res.status(400).json({
        success: false,
        message:
          "sponsor_username, artist_username, message, and offered_amount are required.",
      });
    }

    const data = await sponsorModel.createSponsorOfferRecord({
      sponsor_username,
      artist_username,
      message,
      offered_amount,
    });

    return res.status(201).json({
      success: true,
      message: "Sponsorship offer sent successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to create sponsorship offer.");
  }
};

export const updateSponsorOfferByArtist = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { artist_username, status } = req.body;

    if (!requestId || !artist_username || !status) {
      return res.status(400).json({
        success: false,
        message: "requestId, artist_username, and status are required.",
      });
    }

    const data = await sponsorModel.updateSponsorOfferByArtistRecord({
      requestId,
      artist_username,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Sponsor offer response saved successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to respond to sponsor offer.");
  }
};