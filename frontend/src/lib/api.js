import axios from 'axios'

// Get auth token from localStorage
const getAuthToken = () => {
    try {
        const authStore = localStorage.getItem('auth-store')
        if (authStore) {
            const parsed = JSON.parse(authStore)
            return parsed.state?.token || parsed.token
        }
    } catch (error) {
        console.error('Error getting auth token:', error)
    }
    return null
}

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = getAuthToken()
    console.log(token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.log('Unauthorized access')
        }

        const message = error.response?.data?.message ||
            error.message ||
            'An error occurred'

        return Promise.reject(new Error(message))
    }
)

export default api