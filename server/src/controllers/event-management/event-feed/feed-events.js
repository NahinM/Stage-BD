const events = [
    {
        id: "1",
        title: "Tech Conference 2024",
        description: "Join us for a day of tech talks and networking.",
        type: "Conference",
        is_free: false,
        category: "Technology",
    },
    {
        id: "2",
        title: "Tech Conference 2024",
        description: "Join us for a day of tech talks and networking.",
        type: "Conference",
        is_free: false,
        category: "Technology",
    }
]

export const getEvents = async (req, res) => {
    res.send(events);
}