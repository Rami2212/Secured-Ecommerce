import { create } from 'zustand'
import { ordersApi } from '../services/ordersApi'

export const useOrdersStore = create((set, get) => ({
    // State
    orders: [],
    upcomingOrders: [],
    pastOrders: [],
    currentOrder: null,
    deliveryLocations: [],
    deliveryTimes: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    },
    // Store current filters for refresh purposes
    currentFilters: {},

    // Actions
    getDeliveryLocations: async () => {
        try {
            const response = await ordersApi.getDeliveryLocations()
            set({
                deliveryLocations: response.data.districts,
                error: null
            })
            return response
        } catch (error) {
            set({ error: error.message })
            throw error
        }
    },

    getDeliveryTimes: async () => {
        try {
            const response = await ordersApi.getDeliveryTimes()
            set({
                deliveryTimes: response.data.times,
                error: null
            })
            return response
        } catch (error) {
            set({ error: error.message })
            throw error
        }
    },

    createOrder: async (orderData) => {
        set({ loading: true, error: null })
        try {
            const response = await ordersApi.createOrder(orderData)
            set({ loading: false, error: null })
            // Refresh orders list
            get().getMyOrders()
            return response
        } catch (error) {
            set({
                loading: false,
                error: error.message
            })
            throw error
        }
    },

    getMyOrders: async (params = {}) => {
        set({ loading: true, error: null })
        try {
            const response = await ordersApi.getMyOrders(params)
            set({
                orders: response.data.orders,
                pagination: response.data.pagination,
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

    getUpcomingOrders: async () => {
        set({ loading: true, error: null })
        try {
            const response = await ordersApi.getUpcomingOrders()
            set({
                upcomingOrders: response.data.orders,
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

    getPastOrders: async () => {
        set({ loading: true, error: null })
        try {
            const response = await ordersApi.getPastOrders()
            set({
                pastOrders: response.data.orders,
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

    getOrderById: async (orderId) => {
        set({ loading: true, error: null })
        try {
            const response = await ordersApi.getOrderById(orderId)
            set({
                currentOrder: response.data.order,
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

    updateOrder: async (orderId, orderData) => {
        set({ loading: true, error: null })
        try {
            const response = await ordersApi.updateOrder(orderId, orderData)
            set({ loading: false, error: null })
            // Refresh orders list
            get().getMyOrders()
            return response
        } catch (error) {
            set({
                loading: false,
                error: error.message
            })
            throw error
        }
    },

    cancelOrder: async (orderId, reason) => {
        set({ loading: true, error: null })
        try {
            const response = await ordersApi.cancelOrder(orderId, reason)
            set({ loading: false, error: null })
            // Refresh orders list
            get().getMyOrders()
            return response
        } catch (error) {
            set({
                loading: false,
                error: error.message
            })
            throw error
        }
    },

    // Admin actions
    getAllOrders: async (params = {}) => {
        set({ loading: true, error: null, currentFilters: params })
        try {
            const response = await ordersApi.getAllOrders(params)
            set({
                orders: response.data.orders,
                pagination: response.data.pagination,
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

    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await ordersApi.updateOrderStatus(orderId, status)

            // Update the order in the current orders array immediately
            const { orders, currentFilters } = get()
            const updatedOrders = orders.map(order =>
                (order._id || order.id) === orderId
                    ? { ...order, status }
                    : order
            )

            set({
                orders: updatedOrders,
                error: null
            })

            // Optionally refresh the full list with current filters
            // get().getAllOrders(currentFilters)

            return response
        } catch (error) {
            set({ error: error.message })
            throw error
        }
    },

    getOrderStatistics: async () => {
        try {
            const response = await ordersApi.getOrderStatistics()
            return response
        } catch (error) {
            set({ error: error.message })
            throw error
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Clear current order
    clearCurrentOrder: () => set({ currentOrder: null })
}))