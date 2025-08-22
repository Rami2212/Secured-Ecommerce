import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
    X
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const CreateProduct = () => {
    const navigate = useNavigate()
    const {
        createProduct,
        getCategories,
        categories,
        loading,
        error,
        clearError
    } = useProductsStore()

    const [imagePreview, setImagePreview] = useState('')
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            image: '',
            featured: false
        }
    })

    const watchedImage = watch('image')

    useEffect(() => {
        getCategories()
    }, [getCategories])

    useEffect(() => {
        if (watchedImage && watchedImage.startsWith('http')) {
            setImagePreview(watchedImage)
        }
    }, [watchedImage])

    const handleImageChange = (e) => {
        const value = e.target.value
        setValue('image', value)
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

            await createProduct(productData)
            navigate('/admin/products', {
                state: {
                    message: 'Product created successfully!'
                }
            })
        } catch (error) {
            console.error('Product creation failed:', error)
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
                        <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
                        <p className="text-gray-600">Add a new product to your catalog</p>
                    </div>
                </div>
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

                            <div className="pt-4 border-t space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Create Product
                                </Button>

                                <Link to="/admin/products" className="block">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </form>
        </div>
    )
}

export default CreateProduct