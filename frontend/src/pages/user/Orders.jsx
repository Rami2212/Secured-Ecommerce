import { useState, useEffect } from 'react'
import { useOrdersStore } from '../../stores/ordersStore'
import { Link } from 'react-router-dom'
import { Package, Plus, Calendar, MapPin, Clock, Eye, Edit, X } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Orders = () => {
    const {
        orders,
        loading,
        error,
        pagination,
        getMyOrders,
        cancelOrder,
        clearError
    } = useOrdersStore()

    const [filters, setFilters] = useState({
        status: 'all',
        page: 1,
        limit: 10
    })
    const [cancellingOrder, setCancellingOrder] = useState(null)
    const [cancelReason, setCancelReason] = useState('')

    useEffect(() => {
        getMyOrders(filters)
    }, [getMyOrders, filters])

    const statusOptions = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ]

    const handleStatusFilter = (status) => {
        setFilters(prev => ({ ...prev, status, page: 1 }))
    }

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }))
    }

    const handleCancelOrder = async (orderId) => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation')
            return
        }

        try {
            await cancelOrder(orderId, cancelReason)
            setCancellingOrder(null)
            setCancelReason('')
            // Refresh orders
            getMyOrders(filters)
        } catch (error) {
            console.error('Failed to cancel order:', error)
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800'
            case 'shipped':
                return 'bg-blue-100 text-blue-800'
            case 'confirmed':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const canCancelOrder = (order) => {
        const status = order.status?.toLowerCase()
        return status === 'pending' || status === 'confirmed'
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading && orders.length === 0) {
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">
                        Track and manage all your orders in one place.
                    </p>
                </div>
                <Link to="/orders/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Order
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <Card.Content className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Select
                                value={filters.status}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                                options={statusOptions}
                                placeholder="Filter by status"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setFilters({ status: 'all', page: 1, limit: 10 })}
                        >
                            Clear Filters
                        </Button>
                    </div>
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

            {/* Orders List */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                </div>
            ) : orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order._id || order.id} className="hover:shadow-lg transition-shadow">
                            <Card.Content className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-primary-100 rounded-lg mr-4">
                                                    <Package className="w-6 h-6 text-primary-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {order.productId?.name || order.productName || 'Product'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Order #{order._id?.slice(-8) || order.id?.slice(-8) || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span>
                          Ordered: {formatDate(order.createdAt || order.purchaseDate)}
                        </span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span>
                          Delivery: {order.preferredDeliveryTime || 'Not specified'}
                        </span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span>
                          Location: {order.preferredDeliveryLocation || 'Not specified'}
                        </span>
                                            </div>
                                        </div>

                                        {order.message && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-700">
                                                    <strong>Note:</strong> {order.message}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end">
                                        <div className="text-right mb-4">
                                            <p className="text-sm text-gray-600">Quantity: {order.quantity || 1}</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                ${(order.totalAmount || order.price || 0).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => { window.location.href = `/orders/${order._id || order.id}`}}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>

                                            {canCancelOrder(order) && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => setCancellingOrder(order._id || order.id)}
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    ))}

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
                                ({pagination.total} total orders)
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
            ) : (
                <Card>
                    <Card.Content className="p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-600 mb-6">
                            {filters.status === 'all'
                                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                                : `No orders found with status: ${filters.status}`
                            }
                        </p>
                        <Link to="/orders/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Order
                            </Button>
                        </Link>
                    </Card.Content>
                </Card>
            )}

            {/* Cancel Order Modal */}
            {cancellingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Cancel Order
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to cancel this order? Please provide a reason:
                        </p>
                        <Input
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Reason for cancellation..."
                            className="mb-4"
                        />
                        <div className="flex gap-3">
                            <Button
                                onClick={() => handleCancelOrder(cancellingOrder)}
                                variant="danger"
                                disabled={!cancelReason.trim()}
                                className="flex-1"
                            >
                                Cancel Order
                            </Button>
                            <Button
                                onClick={() => {
                                    setCancellingOrder(null)
                                    setCancelReason('')
                                }}
                                variant="outline"
                                className="flex-1"
                            >
                                Keep Order
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Orders