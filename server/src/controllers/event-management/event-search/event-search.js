export const searchEvents = (req, res) => {
    const { search, filter } = req.query;
    console.log("Search Query:", search);
    console.log("Filter Query:", filter);
    res.send({ message: "Search and filter functionality is under development." });
}