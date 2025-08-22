import { useState, useEffect } from 'react'
import { useOrdersStore } from '../../stores/ordersStore'
import {
    Package,
    Search,
    Filter,
    Eye,
    Edit,
    Calendar,
    MapPin,
    Clock,
    User,
    DollarSign,
    TrendingUp,
    CheckCircle,
    XCircle,
    AlertCircle,
    X
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AdminOrders = () => {
    const {
        orders,
        pagination,
        getAllOrders,
        updateOrderStatus,
        loading,
        error,
        clearError
    } = useOrdersStore()

    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        page: 1,
        limit: 10
    })

    const [localSearch, setLocalSearch] = useState('')
    const [updatingOrders, setUpdatingOrders] = useState(new Set())

    useEffect(() => {
        getAllOrders(filters)
    }, [getAllOrders, filters])

    const statusOptions = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ]

    const getStatusUpdateOptions = (currentStatus) => {
        // Allow all status updates except staying in the same status
        const allOptions = [
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' }
        ]

        // Return all options - admin can update to any status
        return allOptions
    }

    const handleSearch = () => {
        setFilters(prev => ({
            ...prev,
            search: localSearch,
            page: 1
        }))
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }))
    }

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }))
    }

    const handleStatusUpdate = async (orderId, newStatus) => {
        // Add to updating set
        setUpdatingOrders(prev => new Set([...prev, orderId]))

        try {
            await updateOrderStatus(orderId, newStatus)
            // Remove from updating set on success
            setUpdatingOrders(prev => {
                const newSet = new Set(prev)
                newSet.delete(orderId)
                return newSet
            })
        } catch (error) {
            console.error('Failed to update order status:', error)
            // Remove from updating set on error
            setUpdatingOrders(prev => {
                const newSet = new Set(prev)
                newSet.delete(orderId)
                return newSet
            })
        }
    }

    const clearFilters = () => {
        setLocalSearch('')
        setFilters({
            search: '',
            status: 'all',
            page: 1,
            limit: 10
        })
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800'
            case 'processing':
                return 'bg-purple-100 text-purple-800'
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

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return <CheckCircle className="w-4 h-4 text-green-600" />
            case 'processing':
                return <Clock className="w-4 h-4 text-purple-600" />
            case 'shipped':
                return <Package className="w-4 h-4 text-blue-600" />
            case 'confirmed':
                return <AlertCircle className="w-4 h-4 text-yellow-600" />
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-600" />
            default:
                return <Clock className="w-4 h-4 text-gray-600" />
        }
    }

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        } catch {
            return 'N/A'
        }
    }

    const formatCurrency = (amount) => {
        return typeof amount === 'number' ? amount.toFixed(2) : '0.00'
    }

    // Calculate order statistics
    const orderStats = {
        total: orders.length,
        pending: orders.filter(order => order.status === 'pending').length,
        confirmed: orders.filter(order => order.status === 'confirmed').length,
        processing: orders.filter(order => order.status === 'processing').length,
        shipped: orders.filter(order => order.status === 'shipped').length,
        delivered: orders.filter(order => order.status === 'delivered').length,
        cancelled: orders.filter(order => order.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || order.price || 0), 0)
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
                    <p className="text-gray-600">
                        Monitor and manage all customer orders in the system.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analytics
                    </Button>
                    <Button>
                        <Package className="w-4 h-4 mr-2" />
                        Export Orders
                    </Button>
                </div>
            </div>

            {/* Order Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <Card className="col-span-1">
                    <Card.Content className="p-4 text-center">
                        <Package className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                        <p className="text-xl font-bold text-gray-900">{orderStats.total}</p>
                        <p className="text-xs text-gray-600">Total Orders</p>
                    </Card.Content>
                </Card>
                <Card className="col-span-1">
                    <Card.Content className="p-4 text-center">
                        <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                        <p className="text-xl font-bold text-yellow-800">{orderStats.pending}</p>
                        <p className="text-xs text-gray-600">Pending</p>
                    </Card.Content>
                </Card>
                <Card className="col-span-1">
                    <Card.Content className="p-4 text-center">
                        <AlertCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-xl font-bold text-blue-800">{orderStats.confirmed}</p>
                        <p className="text-xs text-gray-600">Confirmed</p>
                    </Card.Content>
                </Card>
                <Card className="col-span-1">
                    <Card.Content className="p-4 text-center">
                        <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-xl font-bold text-purple-800">{orderStats.processing}</p>
                        <p className="text-xs text-gray-600">Processing</p>
                    </Card.Content>
                </Card>
                <Card className="col-span-1">
                    <Card.Content className="p-4 text-center">
                        <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-xl font-bold text-purple-800">{orderStats.shipped}</p>
                        <p className="text-xs text-gray-600">Shipped</p>
                    </Card.Content>
                </Card>
                <Card className="col-span-1">
                    <Card.Content className="p-4 text-center">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-xl font-bold text-green-800">{orderStats.delivered}</p>
                        <p className="text-xs text-gray-600">Delivered</p>
                    </Card.Content>
                </Card>
                <Card className="col-span-1">
                    <Card.Content className="p-4 text-center">
                        <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                        <p className="text-xl font-bold text-red-800">{orderStats.cancelled}</p>
                        <p className="text-xs text-gray-600">Cancelled</p>
                    </Card.Content>
                </Card>
                <Card className="col-span-1">
                    <Card.Content className="p-4 text-center">
                        <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-xl font-bold text-green-800">${formatCurrency(orderStats.totalRevenue)}</p>
                        <p className="text-xs text-gray-600">Revenue</p>
                    </Card.Content>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <Card.Content className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                            <Input
                                placeholder="Search orders, customers, products..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        <Select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            options={statusOptions}
                        />

                        <div className="flex gap-2">
                            <Button onClick={handleSearch} className="flex-1">
                                <Filter className="w-4 h-4 mr-2" />
                                Apply
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear
                            </Button>
                        </div>
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

            {/* Orders Table */}
            <Card>
                <Card.Header>
                    <div className="flex items-center justify-between">
                        <Card.Title>Orders ({pagination?.total || orders.length})</Card.Title>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Showing {orders.length} of {pagination?.total || orders.length}</span>
                        </div>
                    </div>
                </Card.Header>
                <Card.Content className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-900">Order</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Customer</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Product</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Delivery</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Amount</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => {
                                    const orderId = order._id || order.id
                                    const isUpdating = updatingOrders.has(orderId)

                                    return (
                                        <tr key={orderId} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        #{orderId?.slice(-8) || 'N/A'}
                                                    </p>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {formatDate(order.createdAt || order.purchaseDate)}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="font-medium text-gray-900">
                                                            {order.userId?.name || order.customerName || 'Customer'}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {order.userId?.email || order.customerEmail || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {order.productId?.name || order.productName || 'Product'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Qty: {order.quantity || 1}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {order.preferredDeliveryLocation || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {order.preferredDeliveryTime || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {order.purchaseDate ? formatDate(order.purchaseDate) : 'N/A'}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <p className="font-semibold text-gray-900">
                                                    ${formatCurrency(order.totalAmount || order.price || 0)}
                                                </p>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(order.status)}
                                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status || 'pending'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        View
                                                    </Button>

                                                    <div className="relative">
                                                        <Select
                                                            value={order.status || 'pending'}
                                                            onChange={(e) => handleStatusUpdate(orderId, e.target.value)}
                                                            options={getStatusUpdateOptions(order.status)}
                                                            disabled={isUpdating}
                                                            className="text-xs min-w-32"
                                                        />
                                                        {isUpdating && (
                                                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                                                                <LoadingSpinner size="sm" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-600">
                                No orders match the current filter criteria.
                            </p>
                        </div>
                    )}
                </Card.Content>
            </Card>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <Card.Header>
                        <Card.Title>Recent Order Updates</Card.Title>
                    </Card.Header>
                    <Card.Content className="p-6">
                        <div className="space-y-4">
                            {orders.slice(0, 5).map((order) => (
                                <div key={order._id || order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        {getStatusIcon(order.status)}
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                Order #{order._id?.slice(-8) || order.id?.slice(-8)}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {order.userId?.name || 'Customer'} • {formatDate(order.updatedAt || order.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status || 'pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Order Insights</Card.Title>
                    </Card.Header>
                    <Card.Content className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Average Order Value</span>
                                <span className="font-semibold text-gray-900">
                                    ${orderStats.total > 0 ? formatCurrency(orderStats.totalRevenue / orderStats.total) : '0.00'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Completion Rate</span>
                                <span className="font-semibold text-green-600">
                                    {orderStats.total > 0 ?
                                        ((orderStats.delivered / orderStats.total) * 100).toFixed(1) : 0
                                    }%
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Pending Orders</span>
                                <span className="font-semibold text-yellow-600">
                                    {orderStats.pending + orderStats.confirmed}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Cancellation Rate</span>
                                <span className="font-semibold text-red-600">
                                    {orderStats.total > 0 ?
                                        ((orderStats.cancelled / orderStats.total) * 100).toFixed(1) : 0
                                    }%
                                </span>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>
        </div>
    )
}

export default AdminOrders