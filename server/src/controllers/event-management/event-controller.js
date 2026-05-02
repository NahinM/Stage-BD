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
  createEvent: async (req, res) => {
    const { event, venue } = req.body;

    EventVenueModel.add(venue)
      .then((venueData) => {
        event.venue_id = venueData[0].id;

        EventModel.create(event)
          .then((eventData) => {
            // console.log(
            //   "Event created successfully: ",
            //   eventData,
            //   "Venue data: ",
            //   venueData,
            // );
            res.status(201).json({
              success: true,
              message: "Event created successfully",
            });
          })
          .catch((err) => {
            console.error("Error creating event: ", err);
            res.status(500).json({ message: "Error creating event" });
          });
      })
      .catch((err) => {
        console.error("Error creating venue: ", err);
        res.status(500).json({ message: "Error creating venue" });
      });
  },
  updateEvent: async (req, res) => {
    const { id, event } = req.body;
    EventModel.update(id, event)
      .then((data) => {
        res.status(200).json({
          success: true,
          message: "Event updated successfully",
          data: data,
        });
      })
      .catch((err) => {
        console.error("Error updating event: ", err);
        res.status(500).json({ message: "Error updating event" });
      });
  },
  updateVenue: async (req, res) => {
    const { id, venue } = req.body;
    EventVenueModel.update(id, venue)
      .then((data) => {
        res.status(200).json({
          success: true,
          message: "Venue updated successfully",
          data: data,
        });
      })
      .catch((err) => {
        console.error("Error updating venue: ", err);
        res.status(500).json({ message: "Error updating venue" });
      });
  },
  deleteEvent: async (req, res) => {
    const { id } = req.body;
    if (!id) {
      console.warn("Event deletion attempted without ID");
      return res
        .status(400)
        .json({ success: false, message: "Event ID is required" });
    }
    console.log("Received event ID for deletion: ", id);
    EventModel.delete(id)
      .then((data) => {
        res.status(200).json({
          success: true,
          message: "Event deleted successfully",
          data: data,
        });
      })
      .catch((err) => {
        console.error("Error deleting event: ", err);
        res.status(500).json({ message: "Error deleting event" });
      });
  },
  deleteVenue: async (req, res) => {
    const { id } = req.body;
    if (!id) {
      console.warn("Venue deletion attempted without ID");
      return res
        .status(400)
        .json({ success: false, message: "Venue ID is required" });
    }
    console.log("Received request to delete venue with ID: ", id);
    EventVenueModel.delete(id)
      .then((data) => {
        res.status(200).json({
          success: true,
          message: "Venue deleted successfully",
          data: data,
        });
      })
      .catch((err) => {
        console.error("Error deleting venue: ", err);
        res.status(500).json({ message: "Error deleting venue" });
      });
  },
};
