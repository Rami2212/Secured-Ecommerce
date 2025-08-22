import { useState, useEffect } from 'react'
import { useProductsStore } from '../../stores/productsStore'
import { Link } from 'react-router-dom'
import {
    Package,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Filter,
    X,
    DollarSign,
    Boxes
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AdminProducts = () => {
    const {
        products,
        categories,
        loading,
        error,
        pagination,
        filters,
        getProducts,
        getCategories,
        setFilters,
        clearFilters,
        clearError
    } = useProductsStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        getProducts({
            page: 1,
            limit: 12,
            category: selectedCategory,
            search: searchTerm
        })
        getCategories()
    }, [])

    const handleSearch = () => {
        setFilters({
            search: searchTerm,
            category: selectedCategory
        })
        getProducts({
            page: 1,
            limit: 12,
            category: selectedCategory,
            search: searchTerm
        })
    }

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category)
        setFilters({
            search: searchTerm,
            category
        })
        getProducts({
            page: 1,
            limit: 12,
            category,
            search: searchTerm
        })
    }

    const handlePageChange = (page) => {
        getProducts({
            page,
            limit: 12,
            category: selectedCategory,
            search: searchTerm
        })
    }

    const handleClearFilters = () => {
        setSearchTerm('')
        setSelectedCategory('all')
        clearFilters()
        getProducts({ page: 1, limit: 12, category: 'all' })
    }

    const formatPrice = (price) => {
        return typeof price === 'number' ? price.toFixed(2) : '0.00'
    }

    const getStockStatus = (stock) => {
        if (stock > 50) return { color: 'bg-green-100 text-green-800', text: 'In Stock' }
        if (stock > 10) return { color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' }
        if (stock > 0) return { color: 'bg-orange-100 text-orange-800', text: 'Very Low' }
        return { color: 'bg-red-100 text-red-800', text: 'Out of Stock' }
    }

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        ...(categories || []).map(category => ({
            value: category,
            label: category
        }))
    ]

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Management</h1>
                    <p className="text-gray-600">
                        Manage your product catalog and inventory.
                    </p>
                </div>
                <Link to="/admin/products/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <Card.Content className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Content className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Boxes className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{categories?.length || 0}</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Content className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${products.length > 0 ?
                                    formatPrice(products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length) :
                                    '0.00'
                                }
                                </p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Content className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Package className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {products.filter(p => (p.stock || 0) <= 10).length}
                                </p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <Card.Content className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 flex gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Button onClick={handleSearch}>
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <Select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryFilter(e.target.value)}
                                options={categoryOptions}
                                className="min-w-48"
                            />
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                            <Button variant="outline" onClick={handleClearFilters}>
                                Clear
                            </Button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Min Price"
                                type="number"
                                placeholder="0.00"
                            />
                            <Input
                                label="Max Price"
                                type="number"
                                placeholder="999.99"
                            />
                            <Select
                                label="Stock Status"
                                options={[
                                    { value: 'all', label: 'All Stock Levels' },
                                    { value: 'in-stock', label: 'In Stock' },
                                    { value: 'low-stock', label: 'Low Stock' },
                                    { value: 'out-of-stock', label: 'Out of Stock' }
                                ]}
                            />
                        </div>
                    )}
                </Card.Content>
            </Card>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center justify-between">
                    {error}
                    <button onClick={clearError} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Products Grid */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const stockStatus = getStockStatus(product.stock || 0)
                        return (
                            <Card key={product._id || product.id} className="hover:shadow-lg transition-shadow">
                                <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-t-lg overflow-hidden">
                                    <img
                                        src={product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                <Card.Content className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900 truncate flex-1">
                                            {product.name}
                                        </h3>
                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                                            {stockStatus.text}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {product.description || 'No description available'}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Price:</span>
                                            <span className="font-semibold text-primary-600">
                                                ${formatPrice(product.price)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Stock:</span>
                                            <span className="font-medium">{product.stock || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Category:</span>
                                            <span className="font-medium">{product.category || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/admin/products/${product._id || product.id}`}
                                            className="flex-1"
                                        >
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                        <Link
                                            to={`/admin/products/edit/${product._id || product.id}`}
                                            className="flex-1"
                                        >
                                            <Button size="sm" className="w-full">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                </Card.Content>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <Card>
                    <Card.Content className="p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || selectedCategory !== 'all'
                                ? "No products match your current filters. Try adjusting your search criteria."
                                : "Get started by adding your first product to the catalog."
                            }
                        </p>
                        {(!searchTerm && selectedCategory === 'all') && (
                            <Link to="/admin/products/create">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Product
                                </Button>
                            </Link>
                        )}
                    </Card.Content>
                </Card>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
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
        </div>
    )
}

export default AdminProducts