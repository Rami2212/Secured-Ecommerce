import api from '../lib/api'

export const ordersApi = {
    // Get delivery locations
    getDeliveryLocations: async () => {
        const response = await api.get('/orders/delivery-locations')
        return response.data
    },

    // Get delivery times
    getDeliveryTimes: async () => {
        const response = await api.get('/orders/delivery-times')
        return response.data
    },

    // Create new order
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData)
        return response.data
    },

    // Get user's orders
    getMyOrders: async (params = {}) => {
        const { page = 1, limit = 10, status = 'all' } = params
        const response = await api.get('/orders/my-orders', {
            params: { page, limit, status }
        })
        return response.data
    },

    // Get upcoming orders
    getUpcomingOrders: async () => {
        const response = await api.get('/orders/upcoming')
        return response.data
    },

    // Get past orders
    getPastOrders: async () => {
        const response = await api.get('/orders/past')
        return response.data
    },

    // Get order by ID
    getOrderById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`)
        return response.data
    },

    // Update order
    updateOrder: async (orderId, orderData) => {
        const response = await api.put(`/orders/${orderId}`, orderData)
        return response.data
    },

    // Cancel order
    cancelOrder: async (orderId, reason) => {
        const response = await api.patch(`/orders/${orderId}/cancel`, { reason })
        return response.data
    },

    // Admin: Get all orders
    getAllOrders: async (params = {}) => {
        const { page = 1, limit = 10, status = 'all', search = '' } = params
        const response = await api.get('/orders', {
            params: { page, limit, status, search }
        })
        return response.data
    },

    // Admin: Update order status
    updateOrderStatus: async (orderId, status) => {
        const response = await api.patch(`/orders/${orderId}/status`, { status })
        return response.data
    },

    // Admin: Get order statistics
    getOrderStatistics: async () => {
        const response = await api.get('/orders/admin/statistics')
        return response.data
    }
}