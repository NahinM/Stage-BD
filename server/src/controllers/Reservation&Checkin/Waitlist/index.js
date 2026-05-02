// import {
//   isEventFull,
//   joinWaitlist,
//   getWaitlistPosition,
//   getWaitlistByEvent,
//   cancelWaitlistEntry,
//   getOrganizerEvents,
// } from "../../../models/Reservation&Checkin/waitlist/index.js";

// const TEST_USER_ID = "REAL_USER_UUID"; // replace with req.user.id when auth ready
// const TEST_ORGANIZER_ID = "56ead00b-e29d-4269-aea4-20edb2f4bb92"; // replace with req.user.id when auth ready

// export const joinWaitlistController = async (req, res) => {
//   try {
//     const { eventId } = req.body;
//     if (!eventId) return res.status(400).json({ message: "eventId required" });

//     const full = await isEventFull(eventId);
//     if (!full) return res.status(400).json({ message: "Event still has seats available" });

//     const { data, error } = await joinWaitlist(eventId, TEST_USER_ID);
//     if (error) return res.status(400).json({ message: error.message || error });

//     return res.status(201).json({ message: "Joined waitlist", data });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// export const getUserPositionController = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const data = await getWaitlistPosition(eventId, TEST_USER_ID);
//     if (!data) return res.json({ onWaitlist: false });
//     return res.json({ onWaitlist: true, position: data.position, id: data.id });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// export const getEventWaitlistController = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const { data, error } = await getWaitlistByEvent(eventId);
//     if (error) return res.status(500).json({ message: error.message });
//     return res.json(data);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// export const cancelWaitlistController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { data, error } = await cancelWaitlistEntry(id);
//     if (error) return res.status(500).json({ message: error.message });
//     return res.json({ message: "Removed from waitlist", data });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// export const getOrganizerEventsController = async (req, res) => {
//   try {
//     const { data, error } = await getOrganizerEvents(TEST_ORGANIZER_ID);
//     if (error) return res.status(500).json({ message: error.message });
//     return res.json(data);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };


import {
  isEventFull,
  joinWaitlist,
  getWaitlistPosition,
  getWaitlistByEvent,
  cancelWaitlistEntry,
  getOrganizerEvents,
} from "../../../models/Reservation&Checkin/waitlist/index.js";

export const joinWaitlistController = async (req, res) => {
  try {
    const { eventId } = req.body;
    const { userId } = req.query;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!eventId) return res.status(400).json({ message: "eventId required" });

    // removed isEventFull check — anyone can join waitlist
    const { data, error } = await joinWaitlist(eventId, userId);
    if (error) return res.status(400).json({ message: error.message || error });

    return res.status(201).json({ message: "Joined waitlist", data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserPositionController = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.query;
    if (!userId) return res.json({ onWaitlist: false });

    const data = await getWaitlistPosition(eventId, userId);
    if (!data) return res.json({ onWaitlist: false });
    return res.json({ onWaitlist: true, position: data.position, id: data.id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getEventWaitlistController = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { data, error } = await getWaitlistByEvent(eventId);
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const cancelWaitlistController = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await cancelWaitlistEntry(id);
    if (error) return res.status(500).json({ message: error.message });
    return res.json({ message: "Removed from waitlist", data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getOrganizerEventsController = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    const { data, error } = await getOrganizerEvents(userId);
    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};