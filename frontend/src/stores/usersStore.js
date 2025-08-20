import { create } from 'zustand'
import { usersApi } from '../services/usersApi'

export const useUsersStore = create((set, get) => ({
    // State
    dashboardData: null,
    profile: null,
    ordersSummary: null,
    allUsers: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    },

    // Actions
    getDashboard: async () => {
        set({ loading: true, error: null })
        try {
            const response = await usersApi.getDashboard()
            set({
                dashboardData: response.data,
                loading: false,
                error: null
            })
            return response
        } catch (error) {
            set({
                loading: false,
                error: error.message
            })
            throw error
        }
    },

    getProfile: async () => {
        set({ loading: true, error: null })
        try {
            const response = await usersApi.getProfile()
            set({
                profile: response.data.user,
                loading: false,
                error: null
            })
            return response
        } catch (error) {
            set({
                loading: false,
                error: error.message
            })
            throw error
        }
    },

    updateProfile: async (userData) => {
        set({ loading: true, error: null })
        try {
            const response = await usersApi.updateProfile(userData)
            set({
                profile: response.data.user,
                loading: false,
                error: null
            })
            return response
        } catch (error) {
            set({
                loading: false,
                error: error.message
            })
            throw error
        }
    },

    getOrdersSummary: async () => {
        try {
            const response = await usersApi.getOrdersSummary()
            set({
                ordersSummary: response.data.summary,
                error: null
            })
            return response
        } catch (error) {
            set({ error: error.message })
            throw error
        }
    },

    // Admin actions
    getAllUsers: async (params = {}) => {
        set({ loading: true, error: null })
        try {
            const response = await usersApi.getAllUsers(params)
            set({
                allUsers: response.data.users,
                pagination: response.data.pagination || {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    total: 0,
                    totalPages: 0
                },
                loading: false,
                error: null
            })
            return response
        } catch (error) {
            set({
                loading: false,
                error: error.message
            })
            throw error
        }
    },

    // Clear error
    clearError: () => set({ error: null })
}))