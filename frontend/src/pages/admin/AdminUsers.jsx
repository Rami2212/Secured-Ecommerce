import { useState, useEffect } from 'react'
import { useUsersStore } from '../../stores/usersStore'
import {
    Users,
    Search,
    Filter,
    Eye,
    Shield,
    Mail,
    Phone,
    MapPin,
    Calendar,
    UserCheck,
    UserX,
    MoreVertical
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AdminUsers = () => {
    const {
        allUsers,
        pagination,
        getAllUsers,
        loading,
        error
    } = useUsersStore()

    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        role: 'all',
        page: 1,
        limit: 10
    })

    const [localSearch, setLocalSearch] = useState('')

    useEffect(() => {
        getAllUsers(filters)
    }, [getAllUsers, filters])

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' }
    ]

    const roleOptions = [
        { value: 'all', label: 'All Roles' },
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
        { value: 'moderator', label: 'Moderator' }
    ]

    const handleSearch = () => {
        setFilters(prev => ({
            ...prev,
            search: localSearch,
            page: 1
        }))
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }))
    }

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }))
    }

    const clearFilters = () => {
        setLocalSearch('')
        setFilters({
            search: '',
            status: 'all',
            role: 'all',
            page: 1,
            limit: 10
        })
    }

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800'
            case 'moderator':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-green-100 text-green-800'
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'inactive':
                return 'bg-gray-100 text-gray-800'
            case 'suspended':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-green-100 text-green-800'
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading && allUsers.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
                    <p className="text-gray-600">
                        Manage and monitor all user accounts in the system.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Logs
                    </Button>
                    <Button>
                        <Users className="w-4 h-4 mr-2" />
                        Export Users
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <Card.Content className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Input
                                placeholder="Search users..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        <Select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            options={statusOptions}
                        />

                        <Select
                            value={filters.role}
                            onChange={(e) => handleFilterChange('role', e.target.value)}
                            options={roleOptions}
                        />

                        <div className="flex gap-2">
                            <Button onClick={handleSearch} className="flex-1">
                                <Filter className="w-4 h-4 mr-2" />
                                Apply
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <Card>
                <Card.Header>
                    <div className="flex items-center justify-between">
                        <Card.Title>Users ({pagination.total || allUsers.length})</Card.Title>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Showing {allUsers.length} of {pagination.total || allUsers.length}</span>
                        </div>
                    </div>
                </Card.Header>
                <Card.Content className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : allUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-gray-900">User</th>
                                        <th className="text-left p-4 font-medium text-gray-900">Contact</th>
                                        <th className="text-left p-4 font-medium text-gray-900">Role</th>
                                        <th className="text-left p-4 font-medium text-gray-900">Status</th>
                                        <th className="text-left p-4 font-medium text-gray-900">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {allUsers.map((user) => (
                                        <tr key={user._id || user.id} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-primary-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="font-medium text-gray-900">{user.name || 'N/A'}</p>
                                                        <p className="text-sm text-gray-600">@{user.username || 'N/A'}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Phone className="w-3 h-3 mr-1" />
                                                        {user.contactNumber || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {user.country || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                                                    {user.role || 'user'}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor('active')}`}>
                                                    Active
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(user.createdAt)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                            <p className="text-gray-600">
                                No users match the current filter criteria.
                            </p>
                        </div>
                    )}
                </Card.Content>
            </Card>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                    <Button
                        variant="outline"
                        disabled={pagination.page === 1 || loading}
                        onClick={() => handlePageChange(pagination.page - 1)}
                    >
                        Previous
                    </Button>

                    <span className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <Button
                        variant="outline"
                        disabled={pagination.page === pagination.totalPages || loading}
                        onClick={() => handlePageChange(pagination.page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <Card.Content className="p-6 text-center">
                        <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">
                            {allUsers.filter(user => user.role !== 'admin').length}
                        </p>
                        <p className="text-sm text-gray-600">Regular Users</p>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Content className="p-6 text-center">
                        <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">
                            {allUsers.filter(user => user.role === 'admin').length}
                        </p>
                        <p className="text-sm text-gray-600">Administrators</p>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Content className="p-6 text-center">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">
                            {allUsers.filter(user =>
                                new Date(user.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                            ).length}
                        </p>
                        <p className="text-sm text-gray-600">New This Month</p>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Content className="p-6 text-center">
                        <UserX className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">0</p>
                        <p className="text-sm text-gray-600">Suspended</p>
                    </Card.Content>
                </Card>
            </div>
        </div>
    )
}

export default AdminUsers