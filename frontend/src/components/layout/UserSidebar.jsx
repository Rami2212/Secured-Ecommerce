import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, ShoppingBag, Plus } from 'lucide-react'

const UserSidebar = () => {
    const location = useLocation()

    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            path: '/dashboard'
        },
        {
            icon: User,
            label: 'Profile',
            path: '/profile'
        },
        {
            icon: ShoppingBag,
            label: 'My Orders',
            path: '/orders'
        },
        {
            icon: Plus,
            label: 'Create Order',
            path: '/orders/create'
        }
    ]

    const isActive = (path) => location.pathname === path

    return (
        <aside className="w-64 bg-white shadow-sm border-r min-h-full">
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                                isActive(item.path)
                                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

export default UserSidebar