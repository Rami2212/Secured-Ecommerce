import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LogIn, Shield, Eye, EyeOff, ShoppingCart } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Login = () => {
    const { login, isAuthenticated, loading, error, clearError } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const [loginError, setLoginError] = useState('')

    const from = location.state?.from?.pathname || '/dashboard'
    const message = location.state?.message

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm()

    useEffect(() => {
        clearError()
        setLoginError('')
    }, [clearError])

    useEffect(() => {
        if (error) {
            setLoginError(error)
        }
    }, [error])

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, from])

    const onSubmit = async (data) => {
        try {
            clearError()
            setLoginError('')
            
            await login(data)
        } catch (error) {
            console.error('Login failed:', error)
            setLoginError(error.message || 'Login failed. Please try again.')
        }
    }

    if (loading && isAuthenticated) {
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
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Access your secure dashboard and manage your orders
                    </p>
                </div>

                <Card className="mt-8">
                    <Card.Content className="py-8">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            {/* Success message from registration */}
                            {message && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                    {message}
                                </div>
                            )}

                            {/* Error message */}
                            {(error || loginError) && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error || loginError}
                                </div>
                            )}

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
                                placeholder="Enter your email"
                                autoComplete="email"
                            />

                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    error={errors.password?.message}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <Link
                                    to="/register"
                                    className="text-sm text-primary-600 hover:text-primary-500"
                                >
                                    Don't have an account?
                                </Link>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary-600 hover:text-primary-500"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                loading={isSubmitting || loading}
                                disabled={isSubmitting || loading}
                            >
                                <LogIn className="w-5 h-5 mr-2" />
                                Sign In
                            </Button>
                        </form>
                    </Card.Content>
                </Card>

                <p className="text-center text-xs text-gray-600">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}

export default Login