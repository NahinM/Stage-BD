import axios from 'axios';

// Create the instance
const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

export default apiClient;