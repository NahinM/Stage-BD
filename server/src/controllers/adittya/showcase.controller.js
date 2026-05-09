import * as showcaseModel from "../../models/adittya/showcase.js";
import { handleError } from "./_utils.js";

export const getShowcase = async (req, res) => {
  try {
    const data = await showcaseModel.listShowcaseItems();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleError(res, error, "Failed to load showcase items.");
  }
};