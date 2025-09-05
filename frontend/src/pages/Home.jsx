import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useProductsStore } from '../stores/productsStore'
import { ShoppingCart, Shield, Lock, Users, TrendingUp, Star, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProductCard from '../components/product/ProductCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Home = () => {
    const { isAuthenticated, user } = useAuthStore()
    const { featuredProducts, getFeaturedProducts, loading } = useProductsStore()

    useEffect(() => {
        getFeaturedProducts(6)
    }, [getFeaturedProducts])

    const features = [
        {
            icon: Shield,
            title: 'OWASP Secure',
            description: 'Built following OWASP Top 10 security guidelines to protect against common vulnerabilities.'
        },
        {
            icon: Lock,
            title: 'JWT Authentication',
            description: 'Secure authentication and authorization using industry-standard JWT tokens.'
        },
        {
            icon: Users,
            title: 'Role-Based Access',
            description: 'Proper access control ensuring users can only access their own data and orders.'
        },
        {
            icon: ShoppingCart,
            title: 'Secure Shopping',
            description: 'Safe and secure online shopping experience with encrypted data transmission.'
        }
    ]

    const stats = [
        { label: 'Happy Customers', value: '10,000+', icon: Users },
        { label: 'Products Available', value: '5,000+', icon: ShoppingCart },
        { label: 'Orders Delivered', value: '25,000+', icon: TrendingUp },
        { label: 'Security Rating', value: '5/5', icon: Shield }
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-32 flex items-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&q=80"
                        alt="Shopping background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Welcome to BuyWorld
                            <span className="text-primary-400"> Marketplace</span>
                        </h1>
                        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                            Experience safe and secure online shopping with our OWASP-compliant
                            e-commerce platform featuring JWT authentication and modern security practices.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            {isAuthenticated ? (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/dashboard">
                                        <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                    <Link to="/products">
                                        <Button variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-primary-600 font-semibold shadow-lg">
                                            Browse Products
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/register">
                                        <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg">
                                            Get Started Free
                                        </Button>
                                    </Link>
                                    <Link to="/products">
                                        <Button variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-primary-600 font-semibold shadow-lg">
                                            View Products
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Welcome message for authenticated users */}
                        {isAuthenticated && user && (
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 inline-block shadow-lg">
                                <p className="text-gray-700">
                                    Welcome back, <span className="font-semibold text-primary-600">{user.name || user.email}</span>!
                                    Ready to continue shopping?
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <div key={index} className="text-center">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                                    <div className="text-gray-600 text-sm">{stat.label}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Featured Products
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover our handpicked selection of premium products with the best quality and value.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {featuredProducts.slice(0, 6).map(product => (
                                    <ProductCard key={product._id || product.id} product={product} />
                                ))}
                            </div>

                            <div className="text-center">
                                <Link to="/products">
                                    <Button size="lg" variant="outline">
                                        View All Products
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-lg text-gray-600">
                            Trusted by thousands of satisfied customers worldwide.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Johnson",
                                role: "Verified Customer",
                                content: "BuyWorld provides an amazing shopping experience. The security features give me peace of mind when shopping online.",
                                rating: 5
                            },
                            {
                                name: "Mike Chen",
                                role: "Regular Shopper",
                                content: "Fast delivery and excellent customer service. I've been using BuyWorld for months and never had any security concerns.",
                                rating: 5
                            },
                            {
                                name: "Emily Davis",
                                role: "Tech Professional",
                                content: "As someone in tech, I appreciate BuyWorld's robust security measures. The OWASP compliance is impressive.",
                                rating: 5
                            }
                        ].map((testimonial, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <Card.Content className="p-6">
                                    <div className="flex items-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-4 italic">
                                        "{testimonial.content}"
                                    </p>
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </Card.Content>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Start Shopping Securely?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Join thousands of satisfied customers and experience secure online shopping with BuyWorld today.
                    </p>

                    {isAuthenticated ? (
                        <div className="space-x-4">
                            <Link to="/products">
                                <Button size="lg" variant="secondary" className="border-white text-black hover:bg-white hover:text-primary-600">
                                    Browse Products
                                </Button>
                            </Link>
                            <Link to="/dashboard">
                                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-primary-600">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/register">
                                <Button size="lg" variant="secondary">
                                    Create Account
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-primary-600">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Home