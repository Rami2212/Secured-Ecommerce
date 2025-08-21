import { useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useUsersStore } from '../../stores/usersStore'
import { useOrdersStore } from '../../stores/ordersStore'
import { Link } from 'react-router-dom'
import { ShoppingBag, Plus, User, TrendingUp, Clock, CheckCircle, Package, Calendar, MapPin } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Dashboard = () => {
    const { user } = useAuthStore()
    const {
        dashboardData,
        ordersSummary,
        getDashboard,
        getOrdersSummary,
        loading: usersLoading,
        error: usersError
    } = useUsersStore()
    const {
        upcomingOrders,
        getUpcomingOrders,
        loading: ordersLoading,
        error: ordersError
    } = useOrdersStore()

    useEffect(() => {
        getDashboard()
        getOrdersSummary()
        getUpcomingOrders()
    }, [getDashboard, getOrdersSummary, getUpcomingOrders])

    // Default stats if API data is not available
    const defaultStats = {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalSpent: 0
    }

    const stats = ordersSummary || dashboardData?.ordersSummary || defaultStats

    const recentOrders = upcomingOrders.slice(0, 3) || []

    const quickActions = [
        {
            title: 'Create New Order',
            description: 'Place a new order for your favorite products',
            icon: Plus,
            link: '/orders/create',
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            title: 'View All Orders',
            description: 'See your complete order history',
            icon: ShoppingBag,
            link: '/orders',
            color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
            title: 'Update Profile',
            description: 'Manage your account information',
            icon: User,
            link: '/profile',
            color: 'bg-purple-500 hover:bg-purple-600'
        }
    ]

    const formatCurrency = (amount) => {
        return typeof amount === 'number' ? amount.toFixed(2) : '0.00'
    }

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

    if (usersLoading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {user?.name || user?.email || 'User'}!
                </h1>
                <p className="text-primary-100">
                    Here's what's happening with your account today.
                </p>
            </div>

            {/* Error Messages */}
            {(usersError || ordersError) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {usersError || ordersError}
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

                <Card className="hover:shadow-lg transition-shadow">
                    <Card.Content className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <Card.Content className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${formatCurrency(stats.totalSpent)}
                                </p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>

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

            {/* Recent Orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Link to="/orders">
                        <Button variant="outline" size="sm">
                            View All
                        </Button>
                    </Link>
                </div>

                {ordersLoading ? (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner />
                    </div>
                ) : recentOrders.length > 0 ? (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <Card key={order._id || order.id} className="hover:shadow-lg transition-shadow">
                                <Card.Content className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Package className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-semibold text-gray-900">
                                                    {order.productId?.name || order.productName || 'Product'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Order #{order._id?.slice(-8) || order.id?.slice(-8) || 'N/A'}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {new Date(order.purchaseDate || order.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {order.preferredDeliveryTime}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {order.preferredDeliveryLocation}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ${formatCurrency(order.totalAmount || order.price || 0)}
                                            </p>
                                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                                            {order.quantity && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Qty: {order.quantity}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <Card.Content className="p-8 text-center">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent orders</h3>
                            <p className="text-gray-600 mb-4">
                                You haven't placed any orders yet. Start shopping to see your orders here.
                            </p>
                            <Link to="/orders/create">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create First Order
                                </Button>
                            </Link>
                        </Card.Content>
                    </Card>
                )}
            </div>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Activity */}
                <Card>
                    <Card.Header>
                        <Card.Title>Account Activity</Card.Title>
                    </Card.Header>
                    <Card.Content className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <User className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-700">Profile Last Updated</span>
                                </div>
                                <span className="text-sm text-gray-500">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-700">Member Since</span>
                                </div>
                                <span className="text-sm text-gray-500">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                {/* Quick Stats */}
                <Card>
                    <Card.Header>
                        <Card.Title>This Month</Card.Title>
                    </Card.Header>
                    <Card.Content className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Orders Placed</span>
                                <span className="font-semibold text-gray-900">
                  {stats.pendingOrders || 0}
                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Amount Spent</span>
                                <span className="font-semibold text-gray-900">
                  ${formatCurrency(stats.totalSpent || 0)}
                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Delivery Success Rate</span>
                                <span className="font-semibold text-green-600">98%</span>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard