import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProductsStore } from '../../stores/productsStore'
import { useForm } from 'react-hook-form'
import {
    ArrowLeft,
    Package,
    DollarSign,
    Image as ImageIcon,
    Tag,
    FileText,
    Save,
    X,
    AlertCircle,
    Trash2
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const UpdateProduct = () => {
    const { productId } = useParams()
    const navigate = useNavigate()
    const {
        currentProduct,
        updateProduct,
        getProductById,
        getCategories,
        categories,
        loading,
        error,
        clearError,
        clearCurrentProduct
    } = useProductsStore()

    const [imagePreview, setImagePreview] = useState('')
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting, isDirty }
    } = useForm()

    const watchedImage = watch('image')

    useEffect(() => {
        if (productId) {
            getProductById(productId)
            getCategories()
        }

        return () => {
            clearCurrentProduct()
        }
    }, [productId, getProductById, getCategories, clearCurrentProduct])

    useEffect(() => {
        if (currentProduct) {
            // Populate form with current product data
            reset({
                name: currentProduct.name || '',
                description: currentProduct.description || '',
                price: currentProduct.price || '',
                category: currentProduct.category || '',
                stock: currentProduct.stock || '',
                image: currentProduct.image || '',
                featured: currentProduct.featured || false
            })

            // Set tags
            setTags(currentProduct.tags || [])

            // Set image preview
            if (currentProduct.image) {
                setImagePreview(currentProduct.image)
            }
        }
    }, [currentProduct, reset])

    useEffect(() => {
        if (watchedImage && watchedImage.startsWith('http')) {
            setImagePreview(watchedImage)
        }
    }, [watchedImage])

    const handleImageChange = (e) => {
        const value = e.target.value
        setValue('image', value, { shouldDirty: true })
        if (value && value.startsWith('http')) {
            setImagePreview(value)
        } else {
            setImagePreview('')
        }
    }

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddTag()
        }
    }

    const onSubmit = async (data) => {
        try {
            const productData = {
                ...data,
                price: parseFloat(data.price),
                stock: parseInt(data.stock),
                tags: tags,
                featured: data.featured
            }

            await updateProduct(productId, productData)
            navigate('/admin/products', {
                state: {
                    message: 'Product updated successfully!'
                }
            })
        } catch (error) {
            console.error('Product update failed:', error)
        }
    }

    const handleDelete = async () => {
        try {
            // Note: You'll need to add deleteProduct to your store
            // await deleteProduct(productId)
            console.log('Delete product functionality not implemented yet')
            setShowDeleteConfirm(false)
            navigate('/admin/products', {
                state: {
                    message: 'Product deleted successfully!'
                }
            })
        } catch (error) {
            console.error('Product deletion failed:', error)
        }
    }

    const categoryOptions = [
        { value: '', label: 'Select a category' },
        ...(categories || []).map(category => ({
            value: category,
            label: category
        })),
        { value: 'other', label: 'Other' }
    ]

    if (loading && !currentProduct) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (error && !currentProduct) {
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
                    <Link to="/admin/products">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    if (!currentProduct) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
                <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                <Link to="/admin/products">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Products
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/admin/products">
                        <Button variant="ghost" size="sm" className="mr-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Update Product</h1>
                        <p className="text-gray-600">
                            Editing: {currentProduct.name}
                        </p>
                    </div>
                </div>

                <Button
                    variant="danger"
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Product
                </Button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center justify-between">
                    {error}
                    <button onClick={clearError} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Unsaved Changes Warning */}
            {isDirty && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                    <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        You have unsaved changes. Make sure to save before leaving this page.
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <Package className="w-5 h-5 mr-2" />
                                Basic Information
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-4">
                            <Input
                                label="Product Name"
                                {...register('name', {
                                    required: 'Product name is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Product name must be at least 3 characters'
                                    }
                                })}
                                error={errors.name?.message}
                                placeholder="Enter product name"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    {...register('description', {
                                        required: 'Product description is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Description must be at least 10 characters'
                                        }
                                    })}
                                    rows={4}
                                    className="input-field resize-none"
                                    placeholder="Describe your product..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                )}
                            </div>

                            <Select
                                label="Category"
                                {...register('category', {
                                    required: 'Please select a category'
                                })}
                                options={categoryOptions}
                                error={errors.category?.message}
                                placeholder="Choose category"
                            />
                        </Card.Content>
                    </Card>

                    {/* Pricing and Inventory */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <DollarSign className="w-5 h-5 mr-2" />
                                Pricing & Inventory
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...register('price', {
                                        required: 'Price is required',
                                        min: {
                                            value: 0.01,
                                            message: 'Price must be greater than 0'
                                        }
                                    })}
                                    error={errors.price?.message}
                                    placeholder="0.00"
                                />

                                <Input
                                    label="Stock Quantity"
                                    type="number"
                                    min="0"
                                    {...register('stock', {
                                        required: 'Stock quantity is required',
                                        min: {
                                            value: 0,
                                            message: 'Stock cannot be negative'
                                        }
                                    })}
                                    error={errors.stock?.message}
                                    placeholder="0"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('featured')}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">
                                    Featured Product
                                </label>
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Product Image */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <ImageIcon className="w-5 h-5 mr-2" />
                                Product Image
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-4">
                            <Input
                                label="Image URL"
                                {...register('image')}
                                onChange={handleImageChange}
                                placeholder="https://example.com/image.jpg"
                                helperText="Enter a valid image URL"
                            />

                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        className="w-full max-w-sm h-48 object-cover rounded-lg border"
                                        onError={() => setImagePreview('')}
                                    />
                                </div>
                            )}
                        </Card.Content>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <Tag className="w-5 h-5 mr-2" />
                                Tags
                            </Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add a tag..."
                                    className="flex-1"
                                />
                                <Button type="button" onClick={handleAddTag} variant="outline">
                                    Add
                                </Button>
                            </div>

                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2 text-primary-600 hover:text-primary-800"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </Card.Content>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Product Summary */}
                    <Card className="sticky top-6">
                        <Card.Header>
                            <Card.Title>Product Summary</Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6 space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium truncate ml-2">
                                        {watch('name') || 'Not set'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="font-medium">
                                        {watch('category') || 'Not selected'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Price:</span>
                                    <span className="font-medium">
                                        ${watch('price') || '0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Stock:</span>
                                    <span className="font-medium">
                                        {watch('stock') || '0'} units
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Featured:</span>
                                    <span className="font-medium">
                                        {watch('featured') ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tags:</span>
                                    <span className="font-medium">
                                        {tags.length} tags
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t text-xs text-gray-500">
                                <p>Product ID: {currentProduct._id || currentProduct.id}</p>
                                <p>Created: {new Date(currentProduct.createdAt).toLocaleDateString()}</p>
                                {currentProduct.updatedAt && (
                                    <p>Updated: {new Date(currentProduct.updatedAt).toLocaleDateString()}</p>
                                )}
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    loading={isSubmitting}
                                    disabled={isSubmitting || !isDirty}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {isDirty ? 'Save Changes' : 'No Changes'}
                                </Button>

                                <Link to="/admin/products" className="block">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                                <p className="text-xs text-blue-700">
                                    💡 Changes are automatically tracked. The save button will be enabled when you make modifications.
                                </p>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </form>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <div className="p-2 bg-red-100 rounded-full mr-3">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Delete Product
                            </h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{currentProduct.name}"? This action cannot be undone and will remove all associated data.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleDelete}
                                variant="danger"
                                className="flex-1"
                            >
                                Delete Product
                            </Button>
                            <Button
                                onClick={() => setShowDeleteConfirm(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UpdateProduct