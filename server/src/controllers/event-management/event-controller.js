import { EventModel } from "../../models/event-management/event-model.js";
import { EventVenueModel } from "../../models/event-management/venue-model.js";
import { EventCategoryModel } from "../../models/event-management/event-category-model.js";

export const EventController = {
  getEvent: async (req, res) => {
    const eventQuery = req.query ? JSON.parse(req.query.query) : null;
    // console.log("Received event query: ", eventQuery);

    EventModel.read(eventQuery)
      .then((data) => {
        res.status(200).json(data);
        // console.log("Event data retrieved successfully: ", data);
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
  getVenue: async (req, res) => {
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
