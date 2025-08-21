import { Shield, Users, Target, Award, Heart, Globe } from 'lucide-react'
import Card from '../components/ui/Card'

const About = () => {
    const values = [
        {
            icon: Shield,
            title: 'Security First',
            description: 'We prioritize the security and privacy of our customers above everything else.'
        },
        {
            icon: Users,
            title: 'Customer Focused',
            description: 'Every decision we make is centered around creating the best experience for our customers.'
        },
        {
            icon: Target,
            title: 'Quality Products',
            description: 'We carefully curate our product selection to ensure the highest quality standards.'
        },
        {
            icon: Award,
            title: 'Excellence',
            description: 'We strive for excellence in every aspect of our service and platform.'
        }
    ]

    const teamMembers = [
        {
            name: 'Sarah Wilson',
            role: 'CEO & Founder',
            description: 'Leading BuyWorld with a vision for secure and accessible e-commerce.',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b55b?w=150&h=150&fit=crop&crop=face'
        },
        {
            name: 'Michael Chen',
            role: 'CTO',
            description: 'Ensuring our platform maintains the highest security standards.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Head of Operations',
            description: 'Managing seamless order fulfillment and customer satisfaction.',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-50 to-blue-100 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        About BuyWorld
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        We're revolutionizing online shopping with a secure, user-friendly platform
                        that puts customer safety and satisfaction at the heart of everything we do.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
                        <div className="prose prose-lg mx-auto text-gray-600">
                            <p className="mb-6">
                                BuyWorld was founded in 2024 with a simple yet powerful mission: to create the
                                world's most secure and trusted e-commerce platform. Born from the recognition
                                that online security concerns were preventing many people from enjoying the
                                convenience of digital shopping, we set out to build something different.
                            </p>
                            <p className="mb-6">
                                Our platform is built from the ground up with security as the foundation. We
                                follow OWASP Top 10 security guidelines, implement JWT authentication, and
                                maintain the highest standards of data protection. This isn't just about
                                technology—it's about trust.
                            </p>
                            <p>
                                Today, BuyWorld serves thousands of customers worldwide, providing them with
                                a safe, secure, and enjoyable shopping experience. We're not just an e-commerce
                                platform; we're your trusted partner in the digital marketplace.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon
                            return (
                                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                    <Card.Content className="p-6">
                                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Icon className="w-8 h-8 text-primary-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {value.description}
                                        </p>
                                    </Card.Content>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-primary-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <Globe className="w-16 h-16 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-xl mb-8 leading-relaxed">
                            To democratize secure e-commerce by providing a platform where anyone can
                            shop with confidence, knowing their data is protected and their experience
                            is seamless. We believe that security shouldn't be a luxury—it should be
                            the standard.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <div className="bg-white/10 rounded-lg p-6">
                                <Heart className="w-8 h-8 mx-auto mb-3" />
                                <h3 className="font-semibold mb-2">Customer First</h3>
                                <p className="text-sm opacity-90">Every feature we build starts with our customers' needs</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-6">
                                <Shield className="w-8 h-8 mx-auto mb-3" />
                                <h3 className="font-semibold mb-2">Security Always</h3>
                                <p className="text-sm opacity-90">We never compromise on security and privacy protection</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-6">
                                <Award className="w-8 h-8 mx-auto mb-3" />
                                <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
                                <p className="text-sm opacity-90">We maintain the highest standards in everything we do</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About