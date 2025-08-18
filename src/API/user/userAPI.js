import axios from 'axios';

export const registerAPI = async (userData) => {
    const response = await axios.post('/api/register', {
        username: userData?.username,
        email: userData?.email,
        password: userData?.password,
    }, {
        withCredentials: true
    });

    return response?.data;
};

export const loginAPI = async (userData) => {
    const response = await axios.post('/api/login', {
        email: userData?.email,
        password: userData?.password,
    }, {
        withCredentials: true
    });

    return response?.data;
};

export const checkAuthAPI = async () => {
    const response = await axios.get('/api/check-auth', {
        withCredentials: true
    });

    return response?.data;
};

export const logoutAPI = async () => {
    const response = await axios.post('/api/logout', {}, {
        withCredentials: true
    });

    return response?.data;
};

export const userProfileAPI = async () => {
    const response = await axios.get('/api/profile', {
        withCredentials: true
    });

    return response?.data;
};

export const googleLoginAPI = async (idToken) => {
    const response = await axios.post('/api/google-login',
        { idToken }, {
        withCredentials: true
    });

    return response?.data;
};