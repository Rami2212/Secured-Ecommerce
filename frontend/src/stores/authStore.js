import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authApi } from '../services/authApi'

export const useAuthStore = create(
    persist(
        (set, get) => ({
            // ─── STATE ─────────────────────────────
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            initialized: false,

            // ─── ACTIONS ─────────────────────────────

            // Register
            register: async (userData) => {
                set({ loading: true, error: null })
                try {
                    const response = await authApi.register(userData)
                    set({ loading: false, error: null })
                    return response
                } catch (error) {
                    set({ loading: false, error: error.message })
                    throw error
                }
            },

            // Login
            login: async (credentials) => {
                set({ loading: true, error: null })
                try {
                    const response = await authApi.login(credentials)

                    // Updated to match Postman collection response structure
                    const { access_token, user } = response.data

                    set({
                        user,
                        token: access_token,
                        isAuthenticated: true,
                        loading: false,
                        error: null,
                        initialized: true,
                    })

                    return response
                } catch (error) {
                    set({ loading: false, error: error.message })
                    throw error
                }
            },

            // Logout
            logout: async () => {
                set({ loading: true })
                try {
                    await authApi.logout()
                } catch (error) {
                    console.error("Logout error:", error)
                } finally {
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        loading: false,
                        error: null,
                        initialized: true,
                    })
                }
            },

            // Get Profile
            getProfile: async () => {
                const { token } = get()
                if (!token) {
                    set({ initialized: true })
                    return
                }

                set({ loading: true, error: null })
                try {
                    const response = await authApi.getProfile()
                    // Updated to match expected response structure
                    set({
                        user: response.data.user,
                        token,
                        isAuthenticated: true,
                        loading: false,
                        error: null,
                        initialized: true,
                    })
                    return response
                } catch (error) {
                    // clear auth state if token is invalid
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        loading: false,
                        error: null,
                        initialized: true,
                    })
                    throw error
                }
            },

            // Update Profile
            updateProfile: async (userData) => {
                set({ loading: true, error: null })
                try {
                    const response = await authApi.updateProfile(userData)
                    set({
                        user: response.data.user,
                        loading: false,
                        error: null,
                    })
                    return response
                } catch (error) {
                    set({ loading: false, error: error.message })
                    throw error
                }
            },

            // Forgot Password
            forgotPassword: async (email) => {
                set({ loading: true, error: null })
                try {
                    const response = await authApi.forgotPassword(email)
                    set({ loading: false, error: null })
                    return response
                } catch (error) {
                    set({ loading: false, error: error.message })
                    throw error
                }
            },

            // Initialize Auth (rehydrate & verify)
            initializeAuth: async () => {
                const { token } = get()
                if (token) {
                    try {
                        await get().getProfile()
                    } catch (error) {
                        console.error("Token verification failed:", error)
                    }
                } else {
                    set({ initialized: true })
                }
            },

            // Clear Error
            clearError: () => set({ error: null }),
        }),

        // ─── PERSIST CONFIG ────────────────────────
        {
            name: 'auth-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state, error) => {
                if (!error) {
                    set({ initialized: true })
                }
            },
        }
    )
)