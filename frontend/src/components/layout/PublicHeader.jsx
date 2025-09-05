import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { ShoppingCart, User, LogIn, Menu, X, Home, Package, Info, Phone } from 'lucide-react'
import Button from '../ui/Button'

const PublicHeader = () => {
    const { isAuthenticated, user } = useAuthStore()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const navigationLinks = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/products', label: 'Products', icon: Package },
        { to: '/about', label: 'About', icon: Info },
        { to: '/contact', label: 'Contact', icon: Phone }
    ]

    return (
        <>
            <header className="bg-white shadow-sm border-b relative z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <ShoppingCart className="w-8 h-8 text-primary-600" />
                            <span className="text-xl font-bold text-gray-900">BuyWorld</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navigationLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Auth Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-600">
                                        Welcome, {user?.name || user?.email}
                                    </span>
                                    <Link to="/dashboard">
                                        <Button variant="primary" size="sm">
                                            <User className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link to="/login">
                                        <Button variant="outline" size="sm">
                                            <LogIn className="w-4 h-4 mr-2" />
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="primary" size="sm">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Slide-out Menu */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={closeMobileMenu}
                    />

                    {/* Mobile Menu */}
                    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
                        <div className="flex flex-col h-full">
                            {/* Menu Header */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center space-x-2">
                                    <ShoppingCart className="w-6 h-6 text-primary-600" />
                                    <span className="text-lg font-bold text-gray-900">BuyWorld</span>
                                </div>
                                <button
                                    onClick={closeMobileMenu}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Info (if authenticated) */}
                            {isAuthenticated && user && (
                                <div className="p-4 bg-primary-50 border-b">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {user.name || 'User'}
                                            </p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Links */}
                            <nav className="flex-1 px-4 py-6">
                                <ul className="space-y-2">
                                    {navigationLinks.map((link) => {
                                        const Icon = link.icon
                                        return (
                                            <li key={link.to}>
                                                <Link
                                                    to={link.to}
                                                    onClick={closeMobileMenu}
                                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span className="font-medium">{link.label}</span>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>

                                {/* Authenticated User Actions */}
                                {isAuthenticated && (
                                    <div className="mt-8 pt-6 border-t">
                                        <ul className="space-y-2">
                                            <li>
                                                <Link
                                                    to="/dashboard"
                                                    onClick={closeMobileMenu}
                                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                                                >
                                                    <User className="w-5 h-5" />
                                                    <span className="font-medium">Dashboard</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/orders"
                                                    onClick={closeMobileMenu}
                                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                                                >
                                                    <Package className="w-5 h-5" />
                                                    <span className="font-medium">My Orders</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </nav>

                            {/* Auth Actions */}
                            <div className="p-4 border-t bg-gray-50">
                                {isAuthenticated ? (
                                    <div className="space-y-3">
                                        <Link to="/profile" onClick={closeMobileMenu}>
                                            <Button variant="outline" className="w-full justify-center mb-2">
                                                <User className="w-4 h-4 mr-2" />
                                                Profile Settings
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="danger"
                                            className="w-full justify-center"
                                            onClick={() => {
                                                closeMobileMenu()
                                            }}
                                        >
                                            Sign Out
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link to="/login" onClick={closeMobileMenu}>
                                            <Button variant="outline" className="w-full justify-center mb-2">
                                                <LogIn className="w-4 h-4 mr-2" />
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link to="/register" onClick={closeMobileMenu}>
                                            <Button variant="primary" className="w-full justify-center">
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default PublicHeader