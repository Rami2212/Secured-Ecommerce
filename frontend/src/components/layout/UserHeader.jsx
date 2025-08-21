import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { ShoppingCart, LogOut, User } from 'lucide-react'
import Button from '../ui/Button'

const UserHeader = () => {
    const { logout, user } = useAuthStore()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <ShoppingCart className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">SecureCommerce</span>
                    </Link>

                    {/* User Info & Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name || user?.email}
                                </p>
                                <p className="text-xs text-gray-500">User</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="sm"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default UserHeader