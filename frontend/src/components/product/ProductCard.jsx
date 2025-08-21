import { useAuthStore } from '../../stores/authStore'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Star } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const ProductCard = ({ product }) => {
    const { isAuthenticated } = useAuthStore()

    // Handle missing or placeholder images
    const getProductImage = (product) => {
        if (product.image && product.image !== 'placeholder.jpg') {
            return product.image
        }
        // Generate a placeholder image based on category
        const categoryImages = {
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop',
            'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
            'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
            'Books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
            'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
            'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
            'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'
        }
        return categoryImages[product.category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'
    }

    // Format price
    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toFixed(2)
        }
        return parseFloat(price || 0).toFixed(2)
    }

    // Get stock status
    const getStockStatus = () => {
        const stock = product.stock || 0
        if (stock > 10) return { status: 'In Stock', className: 'bg-green-100 text-green-800' }
        if (stock > 0) return { status: 'Low Stock', className: 'bg-yellow-100 text-yellow-800' }
        return { status: 'Out of Stock', className: 'bg-red-100 text-red-800' }
    }

    const stockInfo = getStockStatus()
    const isInStock = (product.stock || 0) > 0
    const productId = product._id || product.id

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            {/* Product Image */}
            <div className="relative overflow-hidden">
                <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'
                    }}
                />

                {/* Category Badge */}
                {product.category && (
                    <div className="absolute top-2 left-2">
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
                    </div>
                )}

                {/* Stock Status */}
                <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full ${stockInfo.className}`}>
            {stockInfo.status}
          </span>
                </div>

                {/* Overlay for out of stock */}
                {!isInStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">Out of Stock</span>
                    </div>
                )}
            </div>

            <Card.Content className="p-4">
                {/* Product Info */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description || 'No description available'}
                    </p>

                    {/* Rating (if available) */}
                    {product.rating && (
                        <div className="flex items-center mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                            i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                ({product.rating}/5)
              </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div>
              <span className="text-2xl font-bold text-primary-600">
                ${formatPrice(product.price)}
              </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                  ${formatPrice(product.originalPrice)}
                </span>
                            )}
                        </div>

                        {product.stock !== undefined && (
                            <span className="text-sm text-gray-500">
                Stock: {product.stock}
              </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to={`/orders/create?productId=${productId}`}
                                className="flex-1"
                            >
                                <Button
                                    className="w-full"
                                    disabled={!isInStock}
                                    size="sm"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    {isInStock ? 'Order Now' : 'Out of Stock'}
                                </Button>
                            </Link>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    console.log('View product details:', productId)
                                }}
                            >
                                <Eye className="w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <Link to="/login" className="w-full">
                            <Button
                                className="w-full"
                                disabled={!isInStock}
                                size="sm"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {isInStock ? 'Sign in to Order' : 'Out of Stock'}
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Additional Info */}
                {product.tags && product.tags.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex flex-wrap gap-1">
                            {product.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                  {tag}
                </span>
                            ))}
                            {product.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                  +{product.tags.length - 3} more
                </span>
                            )}
                        </div>
                    </div>
                )}
            </Card.Content>
        </Card>
    )
}

export default ProductCard