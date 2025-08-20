import { create } from 'zustand'
import { productsApi } from '../services/productsApi'

export const useProductsStore = create((set, get) => ({
    // State
    products: [],
    featuredProducts: [],
    categories: [],
    currentProduct: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
    },
    filters: {
        category: 'all',
        search: '',
        minPrice: '',
        maxPrice: ''
    },

    // Actions
    getProducts: async (params = {}) => {
        set({ loading: true, error: null })
        try {
            const response = await productsApi.getProducts(params)
            set({
                products: response.data.products,
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

    searchProducts: async (params = {}) => {
        set({ loading: true, error: null })
        try {
            const response = await productsApi.searchProducts(params)
            set({
                products: response.data.products,
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

    getCategories: async () => {
        try {
            const response = await productsApi.getCategories()
            set({
                categories: response.data.categories,
                error: null
            })
            return response
        } catch (error) {
            set({ error: error.message })
            throw error
        }
    },

    getFeaturedProducts: async (limit = 8) => {
        try {
            const response = await productsApi.getFeaturedProducts(limit)
            set({
                featuredProducts: response.data.products,
                error: null
            })
            return response
        } catch (error) {
            set({ error: error.message })
            throw error
        }
    },

    getProductById: async (productId) => {
        set({ loading: true, error: null })
        try {
            const response = await productsApi.getProductById(productId)
            set({
                currentProduct: response.data.product,
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

    createProduct: async (productData) => {
        set({ loading: true, error: null })
        try {
            const response = await productsApi.createProduct(productData)
            set({ loading: false, error: null })
            // Refresh products list
            get().getProducts()
            return response
        } catch (error) {
            set({
                loading: false,
                error: error.message
            })
            throw error
        }
    },

    updateProduct: async (productId, productData) => {
        set({ loading: true, error: null })
        try {
            const response = await productsApi.updateProduct(productId, productData)
            set({ loading: false, error: null })
            // Refresh products list
            get().getProducts()
            return response
        } catch (error) {
            set({
                loading: false,
                error: error.message
            })
            throw error
        }
    },

    updateStock: async (productId, stock) => {
        set({ loading: true, error: null })
        try {
            const response = await productsApi.updateStock(productId, stock)
            set({ loading: false, error: null })
            // Refresh products list
            get().getProducts()
            return response
        } catch (error) {
            set({
                loading: false,
                error: error.message
            })
            throw error
        }
    },

    // Filter actions
    setFilters: (filters) => {
        set((state) => ({
            filters: { ...state.filters, ...filters }
        }))
    },

    clearFilters: () => {
        set({
            filters: {
                category: 'all',
                search: '',
                minPrice: '',
                maxPrice: ''
            }
        })
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Clear current product
    clearCurrentProduct: () => set({ currentProduct: null })
}))