import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate, Link } from 'react-router-dom'
import {UserPlus, Shield, Eye, EyeOff, ShoppingCart} from 'lucide-react'
import { useForm } from 'react-hook-form'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Register = () => {
    const { register: registerUser, isAuthenticated, loading, error } = useAuthStore()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm()

    const password = watch('password')

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true })
        }
    }, [isAuthenticated, navigate])

    const countries = [
        { value: 'Sri Lanka', label: 'Sri Lanka' },
        { value: 'India', label: 'India' },
        { value: 'United States', label: 'United States' },
        { value: 'United Kingdom', label: 'United Kingdom' },
        { value: 'Canada', label: 'Canada' },
        { value: 'Australia', label: 'Australia' }
    ]

    const onSubmit = async (data) => {
        try {
            await registerUser({
                email: data.email,
                password: data.password,
                name: data.name,
                username: data.username,
                contactNumber: data.contactNumber,
                country: data.country
            })
            navigate('/login', {
                state: {
                    message: 'Registration successful! Please verify your email before logging in.'
                }
            })
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Link to="/" className="flex items-center space-x-2">
                            <ShoppingCart className="w-16 h-16 text-primary-600" />
                            <span className="text-4xl font-bold text-gray-900">BuyWorld</span>
                        </Link>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join our secure e-commerce platform today
                    </p>
                </div>

                <Card className="mt-8">
                    <Card.Content className="py-8">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="John Doe"
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
                                    placeholder="johndoe123"
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
                                placeholder="john@example.com"
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
                                placeholder="+94771234567"
                            />

                            <Select
                                label="Country"
                                {...register('country', {
                                    required: 'Country is required'
                                })}
                                options={countries}
                                error={errors.country?.message}
                                placeholder="Select your country"
                            />

                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters'
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                            message: 'Password must contain uppercase, lowercase, number and special character'
                                        }
                                    })}
                                    error={errors.password?.message}
                                    placeholder="Enter a strong password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Input
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    error={errors.confirmPassword?.message}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="flex items-center justify-center">
                                <Link
                                    to="/login"
                                    className="text-sm text-primary-600 hover:text-primary-500"
                                >
                                    Already have an account? Sign in
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                <UserPlus className="w-5 h-5 mr-2" />
                                Create Account
                            </Button>
                        </form>
                    </Card.Content>
                </Card>

                <p className="text-center text-xs text-gray-600">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}

export default Register