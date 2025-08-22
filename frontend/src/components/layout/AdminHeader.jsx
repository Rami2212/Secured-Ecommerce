import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { ShoppingCart, LogOut, Shield } from 'lucide-react'
import Button from '../ui/Button'

const AdminHeader = () => {
    const { logout, user } = useAuthStore()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <header className="bg-gray-900 text-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/admin" className="flex items-center space-x-2">
                        <ShoppingCart className="w-8 h-8 text-primary-400" />
                        <span className="text-xl font-bold">Admin Panel</span>
                    </Link>

                    {/* User Info & Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    {user?.name || user?.email}
                                </p>
                                <p className="text-xs text-gray-300">Administrator</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
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

export default AdminHeader