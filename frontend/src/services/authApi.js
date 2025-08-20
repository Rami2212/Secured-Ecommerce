import api from '../lib/api'

export const authApi = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData)
        return response.data
    },

    // Login user
    login: async (credentials) => {
        // show credintials to debug
        const response = await api.post('/auth/login', credentials )
        return response.data
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get('/auth/profile')
        return response.data
    },

    // Update user profile
    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData)
        return response.data
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email })
        return response.data
    },

    // Logout
    logout: async () => {
        const response = await api.post('/auth/logout')
        return response.data
    },

    // Health check
    healthCheck: async () => {
        const response = await api.get('/auth/health')
        return response.data
    }
}