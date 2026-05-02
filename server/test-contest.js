import { createContest } from "./src/models/engagement/contests.js";

async function test() {
    try {
        const res = await createContest({
            title: "Test Contest",
            venue: "Test Venue",
            ending_time: "2026-05-12T00:00:00.000Z",
            prize_giving_time: "2026-05-12T02:00:00.000Z",
            organizer_id: "11111111-1111-1111-1111-111111111111"
        });
        console.log("Success:", res);
    } catch (err) {
        console.error("Error:", err);
    }
}
test();
