import { useState, useEffect } from 'react'
import { useOrdersStore } from '../../stores/ordersStore'
import { useProductsStore } from '../../stores/productsStore'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Calendar, Clock, MapPin, MessageSquare, Package } from 'lucide-react'
import { useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const CreateOrder = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { user } = useAuthStore()
    const {
        createOrder,
        getDeliveryLocations,
        getDeliveryTimes,
        deliveryLocations,
        deliveryTimes,
        loading,
        error
    } = useOrdersStore()
    const {
        products,
        getProducts,
        loading: productsLoading
    } = useProductsStore()

    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            quantity: 1
        }
    })

    const watchedProductId = watch('productId')
    const watchedQuantity = watch('quantity')

    useEffect(() => {
        // Load initial data
        getProducts({ page: 1, limit: 100 })
        getDeliveryLocations()
        getDeliveryTimes()

        // Check if product is pre-selected from URL
        const productId = searchParams.get('productId')
        if (productId) {
            setValue('productId', productId)
        }
    }, [getProducts, getDeliveryLocations, getDeliveryTimes, searchParams, setValue])

    useEffect(() => {
        // Update selected product when productId changes
        if (watchedProductId && products.length > 0) {
            const product = products.find(p => (p._id || p.id) === watchedProductId)
            setSelectedProduct(product)
        } else {
            setSelectedProduct(null)
        }
    }, [watchedProductId, products])

    const onSubmit = async (data) => {
        if (!selectedDate) {
            alert('Please select a delivery date')
            return
        }

        // Validate date is not on Sunday and is in the future
        const dayOfWeek = selectedDate.getDay()
        if (dayOfWeek === 0) {
            alert('Sunday delivery is not available. Please select another date.')
            return
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
            alert('Please select a future date.')
            return
        }

        const orderData = {
            productId: data.productId,
            quantity: parseInt(data.quantity),
            purchaseDate: selectedDate.toISOString().split('T')[0],
            preferredDeliveryTime: data.preferredDeliveryTime,
            preferredDeliveryLocation: data.preferredDeliveryLocation,
            message: data.message || ''
        }

        try {
            await createOrder(orderData)
            navigate('/orders', {
                state: {
                    message: 'Order created successfully! You can track its progress in your orders.'
                }
            })
        } catch (error) {
            console.error('Order creation failed:', error)
        }
    }

    const calculateTotal = () => {
        if (selectedProduct && watchedQuantity) {
            return (selectedProduct.price * parseInt(watchedQuantity)).toFixed(2)
        }
        return '0.00'
    }

    // Filter Sundays from date picker
    const isWeekday = (date) => {
        const day = date.getDay()
        return day !== 0 // 0 is Sunday
    }

    const productOptions = products.map(product => ({
        value: product._id || product.id,
        label: `${product.name} - $${product.price}`
    }))

    if (productsLoading && products.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Order</h1>
                <p className="text-gray-600">
                    Fill in the details below to place your order.
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Selection */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <Package className="w-5 h-5 mr-2" />
                                Product Selection
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-4">
                            <Select
                                label="Product"
                                {...register('productId', {
                                    required: 'Please select a product'
                                })}
                                options={productOptions}
                                error={errors.productId?.message}
                                placeholder="Choose a product"
                            />

                            {selectedProduct && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={selectedProduct.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'}
                                            alt={selectedProduct.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{selectedProduct.name}</h3>
                                            <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                                            <p className="text-lg font-bold text-primary-600">${selectedProduct.price}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Input
                                label="Quantity"
                                type="number"
                                min="1"
                                max={selectedProduct?.stock || 100}
                                {...register('quantity', {
                                    required: 'Quantity is required',
                                    min: {
                                        value: 1,
                                        message: 'Quantity must be at least 1'
                                    },
                                    max: {
                                        value: selectedProduct?.stock || 100,
                                        message: `Maximum quantity available: ${selectedProduct?.stock || 100}`
                                    }
                                })}
                                error={errors.quantity?.message}
                                helperText={selectedProduct ? `Stock available: ${selectedProduct.stock || 0}` : ''}
                            />
                        </Card.Content>
                    </Card>

                    {/* Delivery Details */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Delivery Details
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Delivery Date <span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    filterDate={isWeekday}
                                    minDate={new Date()}
                                    dateFormat="yyyy-MM-dd"
                                    className="input-field w-full"
                                    placeholderText="Select delivery date (no Sundays)"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Note: Sunday delivery is not available
                                </p>
                            </div>

                            <Select
                                label="Preferred Delivery Time"
                                {...register('preferredDeliveryTime', {
                                    required: 'Please select a delivery time'
                                })}
                                options={deliveryTimes.map(time => ({ value: time, label: time }))}
                                error={errors.preferredDeliveryTime?.message}
                                placeholder="Choose delivery time"
                            />

                            <Select
                                label="Delivery Location"
                                {...register('preferredDeliveryLocation', {
                                    required: 'Please select a delivery location'
                                })}
                                options={deliveryLocations.map(location => ({ value: location, label: location }))}
                                error={errors.preferredDeliveryLocation?.message}
                                placeholder="Choose delivery location"
                            />
                        </Card.Content>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Additional Information
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Special Instructions (Optional)
                                </label>
                                <textarea
                                    {...register('message')}
                                    rows={4}
                                    className="input-field resize-none"
                                    placeholder="Any special delivery instructions or notes..."
                                />
                            </div>
                        </Card.Content>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <Card.Header>
                            <Card.Title>Order Summary</Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-4">
                            {/* Customer Info */}
                            <div className="pb-4 border-b">
                                <h4 className="font-semibold text-gray-900 mb-2">Customer</h4>
                                <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                                <p className="text-sm text-gray-600">{user?.contactNumber}</p>
                            </div>

                            {/* Order Details */}
                            {selectedProduct && (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Product</span>
                                        <span className="font-medium">{selectedProduct.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Unit Price</span>
                                        <span className="font-medium">${selectedProduct.price}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Quantity</span>
                                        <span className="font-medium">{watchedQuantity || 1}</span>
                                    </div>
                                    {selectedDate && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Delivery Date</span>
                                            <span className="font-medium">
                                                {selectedDate.toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-primary-600">
                                        ${calculateTotal()}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    loading={isSubmitting}
                                    disabled={isSubmitting || !selectedProduct}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Place Order
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/products')}
                                >
                                    Continue Shopping
                                </Button>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                                <p className="text-xs text-green-700">
                                    🔒 Your order is secured with industry-standard encryption and OWASP security practices.
                                </p>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </form>
        </div>
    )
}

export default CreateOrder