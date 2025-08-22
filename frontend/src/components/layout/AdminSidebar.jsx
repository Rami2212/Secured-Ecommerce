import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, ShoppingBag } from 'lucide-react'

const AdminSidebar = () => {
    const location = useLocation()

    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            path: '/admin'
        },
        {
            icon: Users,
            label: 'Users',
            path: '/admin/users'
        },
        {
            icon: ShoppingBag,
            label: 'Orders',
            path: '/admin/orders'
        },
        {
            icon: ShoppingBag,
            label: 'Products',
            path: '/admin/products'
        }
    ]

    const isActive = (path) => location.pathname === path

    return (
        <aside className="w-64 bg-gray-800 text-white min-h-full">
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                                isActive(item.path)
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

export default AdminSidebar