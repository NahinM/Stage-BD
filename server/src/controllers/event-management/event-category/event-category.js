import { EventCategoryModel } from "../../../models/event-management/event-category-model.js";

export const getEventCategories = (req, res) => {
  EventCategoryModel.read()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch event categories" });
    });
};
