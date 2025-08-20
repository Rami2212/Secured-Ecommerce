import api from '../lib/api'

export const usersApi = {
    // Get user dashboard data
    getDashboard: async () => {
        const response = await api.get('/users/dashboard')
        return response.data
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get('/users/profile')
        return response.data
    },

    // Update user profile
    updateProfile: async (userData) => {
        const response = await api.put('/users/profile', userData)
        return response.data
    },

    // Get orders summary
    getOrdersSummary: async () => {
        const response = await api.get('/users/orders-summary')
        return response.data
    },

    // Admin: Get all users
    getAllUsers: async (params = {}) => {
        const { page = 1, limit = 10, search = '', status = 'all' } = params
        const response = await api.get('/users/all', {
            params: { page, limit, search, status }
        })
        return response.data
    }
}