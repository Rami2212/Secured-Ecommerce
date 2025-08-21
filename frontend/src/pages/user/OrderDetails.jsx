import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useOrdersStore } from '../../stores/ordersStore'
import {
    ArrowLeft,
    Package,
    Calendar,
    Clock,
    MapPin,
    User,
    Phone,
    Mail,
    MessageSquare,
    Edit,
    X,
    CheckCircle,
    Truck,
    AlertCircle
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const OrderDetails = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const {
        currentOrder,
        loading,
        error,
        getOrderById,
        updateOrder,
        cancelOrder,
        clearError,
        clearCurrentOrder
    } = useOrdersStore()

    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({})
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [cancelReason, setCancelReason] = useState('')

    useEffect(() => {
        if (orderId) {
            getOrderById(orderId)
        }

        return () => {
            clearCurrentOrder()
        }
    }, [orderId, getOrderById, clearCurrentOrder])

    useEffect(() => {
        if (currentOrder) {
            setEditData({
                preferredDeliveryTime: currentOrder.preferredDeliveryTime || '',
                preferredDeliveryLocation: currentOrder.preferredDeliveryLocation || '',
                message: currentOrder.message || ''
            })
        }
    }, [currentOrder])

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSaveEdit = async () => {
        try {
            await updateOrder(orderId, editData)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update order:', error)
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        if (currentOrder) {
            setEditData({
                preferredDeliveryTime: currentOrder.preferredDeliveryTime || '',
                preferredDeliveryLocation: currentOrder.preferredDeliveryLocation || '',
                message: currentOrder.message || ''
            })
        }
    }

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation')
            return
        }

        try {
            await cancelOrder(orderId, cancelReason)
            setShowCancelModal(false)
            setCancelReason('')
        } catch (error) {
            console.error('Failed to cancel order:', error)
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'shipped':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'confirmed':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return <CheckCircle className="w-5 h-5" />
            case 'shipped':
                return <Truck className="w-5 h-5" />
            case 'confirmed':
                return <Package className="w-5 h-5" />
            case 'cancelled':
                return <X className="w-5 h-5" />
            default:
                return <AlertCircle className="w-5 h-5" />
        }
    }

    const canEditOrder = (order) => {
        const status = order?.status?.toLowerCase()
        return status === 'pending' || status === 'confirmed'
    }

    const canCancelOrder = (order) => {
        const status = order?.status?.toLowerCase()
        return status === 'pending' || status === 'confirmed'
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDeliveryDate = (dateString) => {
        if (!dateString) return 'Not specified'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                        <button onClick={clearError} className="text-red-500 hover:text-red-700">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="mt-6">
                    <Button onClick={() => navigate('/orders')} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Button>
                </div>
            </div>
        )
    }

    if (!currentOrder) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h2>
                <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate('/orders')} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Button
                        onClick={() => navigate('/orders')}
                        variant="ghost"
                        size="sm"
                        className="mr-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                        <p className="text-gray-600">
                            Order #{currentOrder._id?.slice(-8) || currentOrder.id?.slice(-8) || 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {canEditOrder(currentOrder) && !isEditing && (
                        <Button onClick={handleEdit} variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Order
                        </Button>
                    )}
                    {canCancelOrder(currentOrder) && (
                        <Button
                            onClick={() => setShowCancelModal(true)}
                            variant="danger"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Order
                        </Button>
                    )}
                </div>
            </div>

            {/* Order Status */}
            <Card>
                <Card.Content className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full border ${getStatusColor(currentOrder.status)}`}>
                                {getStatusIcon(currentOrder.status)}
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Order {currentOrder.status || 'Pending'}
                                </h3>
                                <p className="text-gray-600">
                                    Last updated: {formatDate(currentOrder.updatedAt || currentOrder.createdAt)}
                                </p>
                            </div>
                        </div>
                        <span className={`px-4 py-2 rounded-full border ${getStatusColor(currentOrder.status)}`}>
                            {currentOrder.status || 'pending'}
                        </span>
                    </div>
                </Card.Content>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Details */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <Package className="w-5 h-5 mr-2" />
                                Product Details
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={currentOrder.productId?.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'}
                                    alt={currentOrder.productId?.name || 'Product'}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {currentOrder.productId?.name || currentOrder.productName || 'Product'}
                                    </h3>
                                    <p className="text-gray-600">
                                        {currentOrder.productId?.description || 'No description available'}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-lg font-bold text-primary-600">
                                            ${currentOrder.productId?.price || currentOrder.price || 0}
                                        </span>
                                        <span className="text-gray-600">
                                            Quantity: {currentOrder.quantity || 1}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Delivery Information */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Delivery Information
                                {isEditing && (
                                    <div className="ml-auto flex gap-2">
                                        <Button onClick={handleSaveEdit} size="sm">
                                            Save
                                        </Button>
                                        <Button onClick={handleCancelEdit} variant="outline" size="sm">
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Delivery Date</p>
                                        <p className="text-gray-900">
                                            {formatDeliveryDate(currentOrder.purchaseDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-3 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Preferred Time</p>
                                        {isEditing ? (
                                            <Input
                                                value={editData.preferredDeliveryTime}
                                                onChange={(e) => setEditData({...editData, preferredDeliveryTime: e.target.value})}
                                                placeholder="Delivery time"
                                                size="sm"
                                            />
                                        ) : (
                                            <p className="text-gray-900">
                                                {currentOrder.preferredDeliveryTime || 'Not specified'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start md:col-span-2">
                                    <MapPin className="w-4 h-4 mr-3 text-gray-500 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700">Delivery Location</p>
                                        {isEditing ? (
                                            <Input
                                                value={editData.preferredDeliveryLocation}
                                                onChange={(e) => setEditData({...editData, preferredDeliveryLocation: e.target.value})}
                                                placeholder="Delivery location"
                                                size="sm"
                                            />
                                        ) : (
                                            <p className="text-gray-900">
                                                {currentOrder.preferredDeliveryLocation || 'Not specified'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Special Instructions */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Special Instructions
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6">
                            {isEditing ? (
                                <textarea
                                    value={editData.message}
                                    onChange={(e) => setEditData({...editData, message: e.target.value})}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Special delivery instructions..."
                                />
                            ) : (
                                <p className="text-gray-900">
                                    {currentOrder.message || 'No special instructions provided'}
                                </p>
                            )}
                        </Card.Content>
                    </Card>
                </div>

                {/* Order Summary & Customer Info */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Order Summary</Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Unit Price</span>
                                    <span className="font-medium">
                                        ${currentOrder.productId?.price || currentOrder.price || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Quantity</span>
                                    <span className="font-medium">{currentOrder.quantity || 1}</span>
                                </div>
                                <div className="pt-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-primary-600">
                                            ${(currentOrder.totalAmount ||
                                            (currentOrder.productId?.price || currentOrder.price || 0) * (currentOrder.quantity || 1)
                                        ).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t text-xs text-gray-500">
                                <p>Order placed: {formatDate(currentOrder.createdAt)}</p>
                                <p>Order ID: {currentOrder._id || currentOrder.id}</p>
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Customer Information
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-3">
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-3 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Name</p>
                                    <p className="text-gray-900">
                                        {currentOrder.userId?.name || currentOrder.customerName || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-3 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Email</p>
                                    <p className="text-gray-900">
                                        {currentOrder.userId?.email || currentOrder.customerEmail || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-3 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Contact</p>
                                    <p className="text-gray-900">
                                        {currentOrder.userId?.contactNumber || currentOrder.customerPhone || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Cancel Order
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for cancellation
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Please provide a reason..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleCancelOrder}
                                variant="danger"
                                disabled={!cancelReason.trim()}
                                className="flex-1"
                            >
                                Cancel Order
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowCancelModal(false)
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

export default OrderDetails