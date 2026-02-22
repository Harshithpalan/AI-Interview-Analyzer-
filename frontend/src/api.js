import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const analyzeInterview = async (audioBlob, imageBlob, userId) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'interview.wav');
    if (imageBlob) {
        formData.append('image', imageBlob, 'frame.jpg');
    }
    if (userId) {
        formData.append('userId', userId);
    }

    const response = await api.post('/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const fetchHistory = async (userId) => {
    const response = await api.get('/history', {
        params: { userId }
    });
    return response.data;
};

export const loginUser = async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
};

export const registerUser = async (username, password) => {
    const response = await api.post('/register', { username, password });
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post('/logout');
    return response.data;
};

export const getDemoCredentials = async () => {
    const response = await api.get('/demo-credentials');
    return response.data;
};

export default api;
