import api from '../lib/api'

export const productsApi = {
    // Get all products with pagination and filters
    getProducts: async (params = {}) => {
        const { page = 1, limit = 12, category = 'all' } = params
        const response = await api.get('/products', {
            params: { page, limit, category }
        })
        return response.data
    },

    // Search products
    searchProducts: async (params = {}) => {
        const response = await api.get('/products/search', { params })
        return response.data
    },

    // Get product categories
    getCategories: async () => {
        const response = await api.get('/products/categories')
        return response.data
    },

    // Get featured products
    getFeaturedProducts: async (limit = 8) => {
        const response = await api.get('/products/featured', {
            params: { limit }
        })
        return response.data
    },

    // Get product by ID
    getProductById: async (productId) => {
        const response = await api.get(`/products/${productId}`)
        return response.data
    },

    // Create product (Admin only)
    createProduct: async (productData) => {
        const response = await api.post('/products', productData)
        return response.data
    },

    // Update product (Admin only)
    updateProduct: async (productId, productData) => {
        const response = await api.put(`/products/${productId}`, productData)
        return response.data
    },

    // Update product stock (Admin only)
    updateStock: async (productId, stock) => {
        const response = await api.patch(`/products/${productId}/stock`, { stock })
        return response.data
    }
}