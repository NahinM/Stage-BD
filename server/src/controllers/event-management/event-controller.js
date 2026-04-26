import { EventModel } from "../../models/event-management/event-model.js";
import { EventVenueModel } from "../../models/event-management/venue-model.js";
import { EventCategoryModel } from "../../models/event-management/event-category-model.js";

export const EventController = {
  getEvent: async (req, res) => {
    const eventObj = req.query
      ? {
          columns: req.query.columns,
          id: req.query.id,
          search: req.query.search,
          filter: req.query.filter,
        }
      : null;

    EventModel.read(eventObj)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.error("Error retrieving event object: ", err);
        res.status(500).json({ message: "Error retrieving event object" });
      });
  },
  getCategories: async (req, res) => {
    EventCategoryModel.read()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.error("Error retrieving event categories: ", err);
        res.status(500).json({ message: "Error retrieving event categories" });
      });
  },
  getVenues: async (req, res) => {
    const venueID = req.query.venueID || null;
    if (venueID) {
      EventVenueModel.read(venueID)
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          console.error("Error retrieving event venues: ", err);
          res.status(500).json({ message: "Error retrieving event venues" });
        });
    } else {
      res.status(400).json({ message: "Venue ID is required" });
    }
  },
};
