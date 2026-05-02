import axios from 'axios';

async function testAPI() {
    try {
        const artist_id = '2'; // Sharmistha
        const profileRes = await axios.get(`http://localhost:3000/api/artist/${artist_id}/profile`);
        console.log("Profile Data from API:", profileRes.data.data);
    } catch (e) {
        console.error(e.response?.data || e.message);
    }
}
testAPI();
