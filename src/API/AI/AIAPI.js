import axios from 'axios';

export const AIAPI = async ({ prompt }) => {
    const response = await axios.post('https://gemai-server.onrender.com/api/generate-content',
        { prompt }, {
        withCredentials: true
    });

    return response?.data;
};