import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import PublicLayout from './layouts/PublicLayout'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/user/Dashboard'
import Profile from './pages/user/Profile'
import Orders from './pages/user/Orders'
import OrderDetails from "./pages/user/OrderDetails.jsx";
import CreateOrder from './pages/user/CreateOrder'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOrders from './pages/admin/AdminOrders'
import NotFound from './pages/NotFound'
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import CreateProduct from "./pages/admin/CreateProduct.jsx";
import UpdateProduct from "./pages/admin/UpdateProduct.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

function App() {
    const { initializeAuth, loading, initialized } = useAuthStore()

    useEffect(() => {
        initializeAuth()
    }, [initializeAuth])

    // Show loading spinner while initializing auth
    if (!initialized || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/not-found" element={<NotFound />} />
            </Route>

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />
                <Route path="/orders/create" element={<CreateOrder />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/create" element={<CreateProduct />} />
                <Route path="/admin/products/edit/:productId" element={<UpdateProduct />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App