import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useNavigate, Link } from 'react-router-dom'
import {Mail, ArrowLeft, Shield, Send, ShoppingCart} from 'lucide-react'
import { useForm } from 'react-hook-form'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const ForgotPassword = () => {
    const { forgotPassword, loading, error, clearError } = useAuthStore()
    const navigate = useNavigate()
    const [isSubmitted, setIsSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm()

    const watchedEmail = watch('email')

    const onSubmit = async (data) => {
        try {
            clearError()
            await forgotPassword(data.email)
            setIsSubmitted(true)

            // Redirect to login page after 3 seconds with success message
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: `Password reset email sent to ${data.email}. Please check your inbox and follow the instructions to reset your password.`
                    }
                })
            }, 3000)
        } catch (error) {
            console.error('Forgot password failed:', error)
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
                        Forgot Password?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Don't worry! Enter your email address and we'll send you instructions to reset your password.
                    </p>
                </div>

                <Card className="mt-8">
                    <Card.Content className="py-8">
                        {isSubmitted ? (
                            // Success State
                            <div className="text-center space-y-6">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <Send className="w-8 h-8 text-green-600" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Email Sent!
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        We've sent password reset instructions to:
                                    </p>
                                    <p className="font-medium text-primary-600 mb-6">
                                        {watchedEmail}
                                    </p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <Mail className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                                        <div className="text-left">
                                            <h4 className="text-sm font-medium text-blue-900 mb-1">
                                                Check Your Email
                                            </h4>
                                            <p className="text-sm text-blue-700">
                                                Click the link in the email to reset your password. The link will expire in 1 hour for security reasons.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600">
                                    <p>Didn't receive the email?</p>
                                    <p>Check your spam folder or
                                        <button
                                            onClick={() => setIsSubmitted(false)}
                                            className="text-primary-600 hover:text-primary-500 ml-1"
                                        >
                                            try again
                                        </button>
                                    </p>
                                </div>

                                <p className="text-xs text-gray-500">
                                    Redirecting to sign in page in a few seconds...
                                </p>
                            </div>
                        ) : (
                            // Form State
                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                {/* Error message */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                        {error}
                                    </div>
                                )}

                                <div>
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
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        Enter the email address associated with your BuyWorld account
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    <Mail className="w-5 h-5 mr-2" />
                                    Send Reset Instructions
                                </Button>

                                <div className="text-center">
                                    <Link
                                        to="/login"
                                        className="text-sm text-primary-600 hover:text-primary-500"
                                    >
                                        Remember your password? Sign in
                                    </Link>
                                </div>
                            </form>
                        )}
                    </Card.Content>
                </Card>
            </div>
        </div>
    )
}

export default ForgotPassword