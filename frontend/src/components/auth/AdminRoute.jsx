import { useAuthStore } from '../../stores/authStore'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../ui/LoadingSpinner'

const AdminRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuthStore()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Check if user has admin role
    const isAdmin = user?.role === 'admin' || user?.roles?.includes('admin')

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default AdminRoute