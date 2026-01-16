import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

// Login API - Authenticates user and returns token
export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            username,
            password,
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Login failed. Please try again.',
        };
    }
};

// Get User Profile - Fetches logged-in user details
export const getUserProfile = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch profile.',
        };
    }
};

// Get Products - Fetches all products with pagination support
export const getProducts = async (skip = 0, limit = 20) => {
    try {
        const response = await axios.get(`${BASE_URL}/products`, {
            params: {
                skip,
                limit,
            },
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch products.',
        };
    }
};
