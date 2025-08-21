import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useUsersStore } from '../../stores/usersStore'
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Profile = () => {
    const { user } = useAuthStore()
    const {
        profile,
        getProfile,
        updateProfile,
        loading,
        error
    } = useUsersStore()

    const [isEditing, setIsEditing] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm()

    useEffect(() => {
        getProfile()
    }, [getProfile])

    useEffect(() => {
        if (profile || user) {
            const userData = profile || user
            reset({
                name: userData.name || '',
                email: userData.email || '',
                username: userData.username || '',
                contactNumber: userData.contactNumber || '',
                country: userData.country || ''
            })
        }
    }, [profile, user, reset])

    const countries = [
        { value: 'Sri Lanka', label: 'Sri Lanka' },
        { value: 'India', label: 'India' },
        { value: 'United States', label: 'United States' },
        { value: 'United Kingdom', label: 'United Kingdom' },
        { value: 'Canada', label: 'Canada' },
        { value: 'Australia', label: 'Australia' },
        { value: 'Germany', label: 'Germany' },
        { value: 'France', label: 'France' },
        { value: 'Japan', label: 'Japan' },
        { value: 'Singapore', label: 'Singapore' }
    ]

    const onSubmit = async (data) => {
        try {
            await updateProfile(data)
            setIsEditing(false)
            setUpdateSuccess(true)
            setTimeout(() => setUpdateSuccess(false), 3000)
        } catch (error) {
            console.error('Profile update failed:', error)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        const userData = profile || user
        reset({
            name: userData.name || '',
            email: userData.email || '',
            username: userData.username || '',
            contactNumber: userData.contactNumber || '',
            country: userData.country || ''
        })
    }

    const currentUserData = profile || user

    if (loading && !currentUserData) {
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                <p className="text-gray-600">
                    Manage your account information and preferences.
                </p>
            </div>

            {/* Success Message */}
            {updateSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    Profile updated successfully!
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Overview */}
                <div className="lg:col-span-1">
                    <Card>
                        <Card.Content className="p-6 text-center">
                            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-10 h-10 text-primary-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {currentUserData?.name || 'User'}
                            </h3>
                            <p className="text-gray-600 mb-2">
                                @{currentUserData?.username || 'username'}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                {currentUserData?.email}
                            </p>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-center text-gray-600">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Verified Account
                                </div>
                                <div className="flex items-center justify-center text-gray-600">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {currentUserData?.contactNumber || 'Not provided'}
                                </div>
                                <div className="flex items-center justify-center text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {currentUserData?.country || 'Not provided'}
                                </div>
                            </div>

                            {!isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 w-full"
                                    variant="outline"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            )}
                        </Card.Content>
                    </Card>

                    {/* Account Statistics */}
                    <Card className="mt-6">
                        <Card.Header>
                            <Card.Title>Account Statistics</Card.Title>
                        </Card.Header>
                        <Card.Content className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Member since</span>
                                    <span className="font-medium">
                    {currentUserData?.createdAt
                        ? new Date(currentUserData.createdAt).toLocaleDateString()
                        : 'N/A'
                    }
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account Status</span>
                                    <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Role</span>
                                    <span className="font-medium capitalize">
                    {currentUserData?.role || 'User'}
                  </span>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>
                </div>

                {/* Profile Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <Card.Header>
                            <div className="flex items-center justify-between">
                                <Card.Title>Personal Information</Card.Title>
                                {isEditing && (
                                    <div className="flex space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancel}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card.Header>
                        <Card.Content className="p-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        {...register('name', {
                                            required: 'Full name is required',
                                            minLength: {
                                                value: 2,
                                                message: 'Name must be at least 2 characters'
                                            }
                                        })}
                                        error={errors.name?.message}
                                        disabled={!isEditing}
                                    />

                                    <Input
                                        label="Username"
                                        {...register('username', {
                                            required: 'Username is required',
                                            minLength: {
                                                value: 3,
                                                message: 'Username must be at least 3 characters'
                                            },
                                            pattern: {
                                                value: /^[a-zA-Z0-9_]+$/,
                                                message: 'Username can only contain letters, numbers, and underscores'
                                            }
                                        })}
                                        error={errors.username?.message}
                                        disabled={true}
                                    />
                                </div>

                                <Input
                                    label="Email Address"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    error={errors.email?.message}
                                    disabled={true}
                                    helperText="Email cannot be changed for security reasons"
                                />

                                <Input
                                    label="Contact Number"
                                    type="tel"
                                    {...register('contactNumber', {
                                        required: 'Contact number is required',
                                        pattern: {
                                            value: /^\+?[\d\s\-\(\)]+$/,
                                            message: 'Invalid contact number format'
                                        }
                                    })}
                                    error={errors.contactNumber?.message}
                                    disabled={!isEditing}
                                    placeholder="+94771234567"
                                />

                                <Select
                                    label="Country"
                                    {...register('country', {
                                        required: 'Country is required'
                                    })}
                                    options={countries}
                                    error={errors.country?.message}
                                    disabled={!isEditing}
                                />

                                {isEditing && (
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            loading={isSubmitting}
                                            disabled={isSubmitting}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </Card.Content>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Profile