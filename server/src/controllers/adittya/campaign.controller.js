import * as campaignModel from "../../models/adittya/campaign.js";
import { handleError } from "./_utils.js";

export const getCampaigns = async (req, res) => {
  try {
    const data = await campaignModel.listCampaigns();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to load campaigns.");
  }
};

export const createCampaignForArtist = async (req, res) => {
  try {
    const {
      username,
      requesting_username,
      title,
      description,
      goal_amount,
      deadline,
    } = req.body;

    if (
      !username ||
      !requesting_username ||
      !title ||
      !description ||
      !goal_amount ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message:
          "username, requesting_username, title, description, goal_amount, and deadline are required.",
      });
    }

    const data = await campaignModel.createCampaignForArtistRecord({
      username,
      requesting_username,
      title,
      description,
      goal_amount,
      deadline,
    });

    return res.status(201).json({
      success: true,
      message: "Crowdfunding campaign created successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to create crowdfunding campaign.");
  }
};

export const saveContribution = async (req, res) => {
  try {
    const { campaign_id, supporter_username, amount } = req.body;

    const data = await campaignModel.createContributionRecord({
      campaign_id,
      supporter_username,
      amount,
    });

    return res.status(201).json({
      success: true,
      message: "Contribution saved successfully.",
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to save contribution.");
  }
};