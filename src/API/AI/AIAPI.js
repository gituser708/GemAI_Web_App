import axios from 'axios';

export const AIAPI = async ({ prompt }) => {
    const response = await axios.post('/api/generate-content',
        { prompt }, {
        withCredentials: true
    });

    return response?.data;
};