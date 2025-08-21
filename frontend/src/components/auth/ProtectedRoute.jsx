import { useAuthStore } from '../../stores/authStore'
import { Navigate, useLocation } from 'react-router-dom'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, initialized } = useAuthStore()
    const location = useLocation()

    // Still initializing or loading
    if (!initialized || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    // Not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute