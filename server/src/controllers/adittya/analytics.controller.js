import * as analyticsModel from "../../models/adittya/analytics.js";
import { handleError } from "./_utils.js";

export const getEventAnalytics = async (req, res) => {
  try {
    const { username } = req.query;

    const data = await analyticsModel.listEventAnalytics(username);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to load event analytics.");
  }
};