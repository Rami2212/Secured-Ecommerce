import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HeadphonesIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            details: 'support@buyworld.com',
            subtext: 'We reply within 24 hours'
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: '+1 (555) 123-4567',
            subtext: 'Mon-Fri 9AM-6PM EST'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            details: '123 Commerce Street, Business District',
            subtext: 'New York, NY 10001'
        },
        {
            icon: Clock,
            title: 'Business Hours',
            details: 'Monday - Friday: 9:00 AM - 6:00 PM',
            subtext: 'Saturday: 10:00 AM - 4:00 PM'
        }
    ]

    const supportOptions = [
        {
            icon: MessageSquare,
            title: 'General Inquiries',
            description: 'Questions about our products, services, or platform'
        },
        {
            icon: HeadphonesIcon,
            title: 'Technical Support',
            description: 'Help with account issues, orders, or technical problems'
        },
        {
            icon: Mail,
            title: 'Business Partnerships',
            description: 'Interested in partnering with BuyWorld'
        }
    ]

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1000))

            setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.')
            reset()
        } catch (error) {
            setSubmitMessage('Sorry, there was an error sending your message. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-50 to-blue-100 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Contact BuyWorld
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We're here to help! Reach out to us with any questions, concerns, or feedback.
                        Our dedicated support team is ready to assist you.
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon
                            return (
                                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                    <Card.Content className="p-6">
                                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Icon className="w-8 h-8 text-primary-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {info.title}
                                        </h3>
                                        <p className="text-gray-900 font-medium mb-1">
                                            {info.details}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {info.subtext}
                                        </p>
                                    </Card.Content>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form and Support Options */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                            <Card>
                                <Card.Content className="p-8">
                                    {submitMessage && (
                                        <div className={`mb-6 p-4 rounded-lg ${
                                            submitMessage.includes('Thank you')
                                                ? 'bg-green-50 border border-green-200 text-green-700'
                                                : 'bg-red-50 border border-red-200 text-red-700'
                                        }`}>
                                            {submitMessage}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="First Name"
                                                {...register('firstName', {
                                                    required: 'First name is required'
                                                })}
                                                error={errors.firstName?.message}
                                                placeholder="John"
                                            />
                                            <Input
                                                label="Last Name"
                                                {...register('lastName', {
                                                    required: 'Last name is required'
                                                })}
                                                error={errors.lastName?.message}
                                                placeholder="Doe"
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
                                            label="Phone Number (Optional)"
                                            type="tel"
                                            {...register('phone')}
                                            placeholder="+1 (555) 123-4567"
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Subject
                                            </label>
                                            <select
                                                {...register('subject', {
                                                    required: 'Please select a subject'
                                                })}
                                                className="input-field"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="support">Technical Support</option>
                                                <option value="order">Order Issue</option>
                                                <option value="billing">Billing Question</option>
                                                <option value="partnership">Business Partnership</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.subject && (
                                                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Message
                                            </label>
                                            <textarea
                                                {...register('message', {
                                                    required: 'Message is required',
                                                    minLength: {
                                                        value: 10,
                                                        message: 'Message must be at least 10 characters'
                                                    }
                                                })}
                                                rows={6}
                                                className="input-field resize-none"
                                                placeholder="Please describe your inquiry in detail..."
                                            />
                                            {errors.message && (
                                                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full"
                                            loading={isSubmitting}
                                            disabled={isSubmitting}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </Button>
                                    </form>
                                </Card.Content>
                            </Card>
                        </div>

                        {/* Office Details */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">BuyWorld Headquarters</h2>
                            <Card>
                                <Card.Content className="p-8">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <MapPin className="w-5 h-5 text-primary-600 mr-3 mt-1" />
                                            <div>
                                                <p className="font-medium text-gray-900">Address</p>
                                                <p className="text-gray-600">123 Commerce Street<br />Business District<br />New York, NY 10001</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <Clock className="w-5 h-5 text-primary-600 mr-3 mt-1" />
                                            <div>
                                                <p className="font-medium text-gray-900">Office Hours</p>
                                                <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <Phone className="w-5 h-5 text-primary-600 mr-3 mt-1" />
                                            <div>
                                                <p className="font-medium text-gray-900">Phone</p>
                                                <p className="text-gray-600">+1 (555) 123-4567</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <Mail className="w-5 h-5 text-primary-600 mr-3 mt-1" />
                                            <div>
                                                <p className="font-medium text-gray-900">Email</p>
                                                <p className="text-gray-600">support@buyworld.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact