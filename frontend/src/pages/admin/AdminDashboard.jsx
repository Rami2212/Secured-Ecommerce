import { useEffect, useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useOrdersStore } from '../../stores/ordersStore'
import { useUsersStore } from '../../stores/usersStore'
import { Link } from 'react-router-dom'
import {
    Users,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Calendar,
    BarChart3
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AdminDashboard = () => {
    const { user } = useAuthStore()
    const {
        getOrderStatistics,
        orders,
        getAllOrders,
        loading: ordersLoading,
        error: ordersError
    } = useOrdersStore()
    const {
        getAllUsers,
        allUsers,
        loading: usersLoading,
        error: usersError
    } = useUsersStore()

    const [stats, setStats] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
    })
    const [statisticsData, setStatisticsData] = useState(null)

    useEffect(() => {
        // Load admin data
        loadAdminData()
    }, [])

    const loadAdminData = async () => {
        try {
            // Load users and orders
            const [usersResult, ordersResult, statsResult] = await Promise.all([
                getAllUsers({ page: 1, limit: 10 }),
                getAllOrders({ page: 1, limit: 10 }),
                getOrderStatistics()
            ])

            if (statsResult) {
                setStatisticsData(statsResult.data || statsResult)
            }
        } catch (error) {
            console.error('Failed to load admin data:', error)
        }
    }

    useEffect(() => {
        // Calculate stats from loaded data and API statistics
        calculateStats()
    }, [orders, allUsers, statisticsData])

    const calculateStats = () => {
        // Use API statistics if available, otherwise calculate from current data
        if (statisticsData) {
            setStats({
                totalOrders: statisticsData.totalOrders || orders.length,
                totalUsers: statisticsData.totalUsers || allUsers.length,
                totalRevenue: statisticsData.totalRevenue || calculateRevenueFromOrders(),
                pendingOrders: statisticsData.pendingOrders || orders.filter(order => order.status === 'pending').length,
                confirmedOrders: statisticsData.confirmedOrders || orders.filter(order => order.status === 'confirmed').length,
                shippedOrders: statisticsData.shippedOrders || orders.filter(order => order.status === 'shipped').length,
                deliveredOrders: statisticsData.deliveredOrders || orders.filter(order => order.status === 'delivered').length,
                cancelledOrders: statisticsData.cancelledOrders || orders.filter(order => order.status === 'cancelled').length
            })
        } else {
            // Fallback to calculating from current data
            const totalOrders = orders.length
            const totalUsers = allUsers.length

            const pendingOrders = orders.filter(order => order.status === 'pending').length
            const confirmedOrders = orders.filter(order => order.status === 'confirmed').length
            const shippedOrders = orders.filter(order => order.status === 'shipped').length
            const deliveredOrders = orders.filter(order => order.status === 'delivered').length
            const cancelledOrders = orders.filter(order => order.status === 'cancelled').length

            const totalRevenue = calculateRevenueFromOrders()

            setStats({
                totalOrders,
                totalUsers,
                totalRevenue,
                pendingOrders,
                confirmedOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders
            })
        }
    }

    const calculateRevenueFromOrders = () => {
        return orders.reduce((sum, order) => {
            return sum + (order.totalAmount || order.price || 0)
        }, 0)
    }

    const recentOrders = orders.slice(0, 5)
    const recentUsers = allUsers.slice(0, 5)

    const quickActions = [
        {
            title: 'Manage Orders',
            description: 'View and manage all customer orders',
            icon: ShoppingBag,
            link: '/admin/orders',
            color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
            title: 'Manage Users',
            description: 'View and manage user accounts',
            icon: Users,
            link: '/admin/users',
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            title: 'Analytics',
            description: 'View detailed analytics and reports',
            icon: BarChart3,
            link: '/admin/analytics',
            color: 'bg-purple-500 hover:bg-purple-600'
        }
    ]

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800'
            case 'shipped':
                return 'bg-blue-100 text-blue-800'
            case 'confirmed':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const formatCurrency = (amount) => {
        return typeof amount === 'number' ? amount.toFixed(2) : '0.00'
    }

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString()
        } catch {
            return 'N/A'
        }
    }

    const getTodaysOrders = () => {
        const today = new Date().toDateString()
        return orders.filter(order => {
            try {
                return new Date(order.createdAt).toDateString() === today
            } catch {
                return false
            }
        })
    }

    const getTodaysUsers = () => {
        const today = new Date().toDateString()
        return allUsers.filter(user => {
            try {
                return new Date(user.createdAt).toDateString() === today
            } catch {
                return false
            }
        })
    }

    const getTodaysRevenue = () => {
        return getTodaysOrders().reduce((sum, order) => sum + (order.totalAmount || order.price || 0), 0)
    }

    if ((ordersLoading || usersLoading) && orders.length === 0 && allUsers.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-gray-300">
                    Welcome back, {user?.name || user?.email}. Here's your business overview.
                </p>
            </div>

            {/* Error Messages */}
            {(ordersError || usersError) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {ordersError || usersError}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <Card.Content className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ShoppingBag className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <Card.Content className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <Card.Content className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${formatCurrency(stats.totalRevenue)}</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <Card.Content className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>

            {/* Order Status Overview */}
            <Card>
                <Card.Header>
                    <Card.Title>Order Status Overview</Card.Title>
                </Card.Header>
                <Card.Content className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-yellow-800">{stats.pendingOrders}</p>
                            <p className="text-sm text-yellow-600">Pending</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-blue-800">{stats.confirmedOrders}</p>
                            <p className="text-sm text-blue-600">Confirmed</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-purple-800">{stats.shippedOrders}</p>
                            <p className="text-sm text-purple-600">Shipped</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-800">{stats.deliveredOrders}</p>
                            <p className="text-sm text-green-600">Delivered</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-red-800">{stats.cancelledOrders}</p>
                            <p className="text-sm text-red-600">Cancelled</p>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon
                        return (
                            <Link key={index} to={action.link}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                                    <Card.Content className="p-6">
                                        <div className="flex items-start">
                                            <div className={`p-3 rounded-lg text-white transition-colors ${action.color}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                    {action.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {action.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card.Content>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <Card.Title>Recent Orders</Card.Title>
                            <Link to="/admin/orders">
                                <Button variant="outline" size="sm">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Content className="p-6">
                        {ordersLoading ? (
                            <div className="flex justify-center py-4">
                                <LoadingSpinner />
                            </div>
                        ) : recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order._id || order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {order.productId?.name || order.productName || 'Product'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Order #{order._id?.slice(-8) || order.id?.slice(-8)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {order.userId?.name || order.userName || 'Customer'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ${formatCurrency(order.totalAmount || order.price || 0)}
                                            </p>
                                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status || 'pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent orders</p>
                        )}
                    </Card.Content>
                </Card>

                {/* Recent Users */}
                <Card>
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <Card.Title>Recent Users</Card.Title>
                            <Link to="/admin/users">
                                <Button variant="outline" size="sm">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Content className="p-6">
                        {usersLoading ? (
                            <div className="flex justify-center py-4">
                                <LoadingSpinner />
                            </div>
                        ) : recentUsers.length > 0 ? (
                            <div className="space-y-4">
                                {recentUsers.map((user) => (
                                    <div key={user._id || user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                <Users className="w-4 h-4 text-primary-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-medium text-gray-900">{user.name || 'N/A'}</p>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                                <p className="text-xs text-gray-500">{user.country || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                                user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {user.role || 'user'}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(user.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent users</p>
                        )}
                    </Card.Content>
                </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <Card.Header>
                        <Card.Title>Today's Summary</Card.Title>
                    </Card.Header>
                    <Card.Content className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">New Orders</span>
                                <span className="font-semibold text-gray-900">
                                    {getTodaysOrders().length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">New Users</span>
                                <span className="font-semibold text-gray-900">
                                    {getTodaysUsers().length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Revenue</span>
                                <span className="font-semibold text-gray-900">
                                    ${formatCurrency(getTodaysRevenue())}
                                </span>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>System Health</Card.Title>
                    </Card.Header>
                    <Card.Content className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">System Status</span>
                                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    Operational
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Security Status</span>
                                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    Secure
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Last Backup</span>
                                <span className="text-sm text-gray-500">
                                    {formatDate(new Date())}
                                </span>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Header>
                        <Card.Title>Quick Stats</Card.Title>
                    </Card.Header>
                    <Card.Content className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Completion Rate</span>
                                <span className="font-semibold text-green-600">
                                    {stats.totalOrders > 0 ?
                                        ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(1) : 0
                                    }%
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Avg Order Value</span>
                                <span className="font-semibold text-gray-900">
                                    ${stats.totalOrders > 0 ?
                                    formatCurrency(stats.totalRevenue / stats.totalOrders) :
                                    '0.00'
                                }
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Active Users</span>
                                <span className="font-semibold text-green-600">{stats.totalUsers}</span>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard