import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useProductsStore } from '../stores/productsStore'
import { Link } from 'react-router-dom'
import ProductCard from '../components/product/ProductCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Search, Filter, X } from 'lucide-react'

const Products = () => {
    const { isAuthenticated } = useAuthStore()
    const {
        products,
        categories,
        loading,
        error,
        pagination,
        filters,
        getProducts,
        searchProducts,
        getCategories,
        setFilters,
        clearFilters
    } = useProductsStore()

    const [localFilters, setLocalFilters] = useState({
        search: '',
        category: 'all',
        minPrice: '',
        maxPrice: ''
    })

    useEffect(() => {
        // Load initial data
        getCategories()
        getProducts({ page: 1, limit: 12, category: 'all' })
    }, [getCategories, getProducts])

    const handleSearch = async () => {
        if (localFilters.search || localFilters.category !== 'all' || localFilters.minPrice || localFilters.maxPrice) {
            const searchParams = {
                q: localFilters.search,
                category: localFilters.category === 'all' ? '' : localFilters.category,
                minPrice: localFilters.minPrice,
                maxPrice: localFilters.maxPrice
            }
            await searchProducts(searchParams)
        } else {
            await getProducts({ page: 1, limit: 12, category: 'all' })
        }
        setFilters(localFilters)
    }

    const handleClearFilters = async () => {
        const resetFilters = {
            search: '',
            category: 'all',
            minPrice: '',
            maxPrice: ''
        }
        setLocalFilters(resetFilters)
        clearFilters()
        await getProducts({ page: 1, limit: 12, category: 'all' })
    }

    const handlePageChange = async (page) => {
        if (filters.search || filters.category !== 'all' || filters.minPrice || filters.maxPrice) {
            await searchProducts({
                q: filters.search,
                category: filters.category === 'all' ? '' : filters.category,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                page
            })
        } else {
            await getProducts({ page, limit: 12, category: 'all' })
        }
    }

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat, label: cat }))
    ]

    if (loading && products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
                <p className="text-gray-600">
                    Discover our wide range of quality products with secure shopping experience.
                </p>
            </div>

            {/* Filters */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2 relative">
                        <Input
                            placeholder="Search products..."
                            value={localFilters.search}
                            onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    <Select
                        value={localFilters.category}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value }))}
                        options={categoryOptions}
                        placeholder="Category"
                    />

                    <Input
                        type="number"
                        placeholder="Min Price"
                        value={localFilters.minPrice}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    />

                    <Input
                        type="number"
                        placeholder="Max Price"
                        value={localFilters.maxPrice}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    />
                </div>

                <div className="flex gap-4 mt-4">
                    <Button onClick={handleSearch} disabled={loading}>
                        <Filter className="w-4 h-4 mr-2" />
                        Apply Filters
                    </Button>

                    <Button variant="outline" onClick={handleClearFilters}>
                        <X className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Products Grid */}
            {loading ? (
                <div className="flex items-center justify-center min-h-64">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {products.map(product => (
                            <ProductCard
                                key={product._id || product.id}
                                product={product}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-4">
                            <Button
                                variant="outline"
                                disabled={pagination.page === 1 || loading}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                Previous
                            </Button>

                            <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
                                ({pagination.total} total products)
              </span>

                            <Button
                                variant="outline"
                                disabled={pagination.page === pagination.totalPages || loading}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* No products found */}
            {!loading && products.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">No products found matching your criteria.</p>
                    <Button variant="outline" onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                </div>
            )}

            {/* Call to Action for non-authenticated users */}
            {!isAuthenticated && (
                <div className="bg-primary-50 rounded-lg p-8 text-center mt-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Ready to Start Shopping?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Sign in to your account to purchase products and manage your orders.
                    </p>
                    <div className="space-x-4">
                        <Link to="/login">
                            <Button>Sign In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline">Create Account</Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Products