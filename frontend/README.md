# SecureCommerce - Secure E-commerce Frontend

A modern, secure React-based e-commerce frontend application built with OWASP security best practices and JWT authentication.

## 🚀 Features

### 🔐 Security Features
- **OWASP Top 10 Compliance** - Built following OWASP security guidelines
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin and user role separation
- **Input Validation** - Comprehensive form validation with react-hook-form
- **XSS Protection** - React's built-in XSS prevention
- **CSRF Protection** - Proper token handling and validation

### 🛒 E-commerce Features
- **Product Catalog** - Browse and search products with filters
- **Order Management** - Create, view, and manage orders
- **User Dashboard** - Personal dashboard with order statistics
- **Admin Panel** - Complete admin interface for managing users and orders
- **Responsive Design** - Works on all devices and screen sizes

### 🎨 Modern UI/UX
- **Tailwind CSS** - Modern, responsive styling
- **Lucide React Icons** - Beautiful, consistent iconography
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time form validation with helpful messages

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000` (or configure in .env)

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rami2212/Secured-Ecommerce
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:5000/api
   
   # App Configuration
   VITE_APP_NAME=SecureCommerce
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (headers, footers, sidebars)
│   ├── product/        # Product-related components
│   └── ui/             # Basic UI components (buttons, inputs, cards)
├── layouts/            # Page layouts
│   ├── PublicLayout.jsx
│   ├── UserLayout.jsx
│   └── AdminLayout.jsx
├── pages/              # Application pages
│   ├── auth/           # Authentication pages
│   ├── user/           # User dashboard pages
│   └── admin/          # Admin panel pages
├── services/           # API service files
│   ├── authApi.js
│   ├── productsApi.js
│   ├── ordersApi.js
│   └── usersApi.js
├── stores/             # Zustand state management
│   ├── authStore.js
│   ├── productsStore.js
│   ├── ordersStore.js
│   └── usersStore.js
├── lib/                # Utility libraries
│   └── api.js          # Axios configuration
└── App.jsx             # Main application component
```

## 🎯 Key Dependencies

### Core
- **React 18** - UI framework
- **React Router Dom** - Client-side routing
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### State Management
- **Zustand** - Lightweight state management
- **React Hook Form** - Form state management and validation

### UI & Icons
- **Lucide React** - Icon library
- **React DatePicker** - Date selection component

### HTTP Client
- **Axios** - HTTP client with interceptors

## 🛡️ Security Implementation

### Authentication Flow
1. User submits login credentials
2. Backend validates and returns JWT token
3. Token stored in localStorage and Zustand store
4. Token included in all authenticated API requests
5. Token validated on app initialization

### Route Protection
- **Public Routes**: Accessible to all users
- **Protected Routes**: Require authentication
- **Admin Routes**: Require admin role

### Input Validation
- Client-side validation with react-hook-form
- Schema validation for all form inputs
- XSS prevention through React's built-in protection

## 📱 User Roles & Features

### Public Users
- Browse products
- View product details
- Access to registration and login

### Authenticated Users
- Personal dashboard with order statistics
- Create and manage orders
- Update profile information
- View order history

### Administrators
- Admin dashboard with system overview
- User management (view, search, filter users)
- Order management (view, update order status)
- System statistics and insights

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Linting & Formatting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## 🔄 API Endpoints Used

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/logout` - User logout

### Products
- `GET /products` - Get all products (with pagination)
- `GET /products/search` - Search products
- `GET /products/categories` - Get product categories
- `GET /products/featured` - Get featured products

### Orders
- `GET /orders/my-orders` - Get user orders
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order
- `PATCH /orders/:id/cancel` - Cancel order
- `GET /orders/delivery-locations` - Get delivery locations
- `GET /orders/delivery-times` - Get available delivery times

### Admin
- `GET /users/all` - Get all users (admin)
- `GET /orders` - Get all orders (admin)
- `PATCH /orders/:id/status` - Update order status (admin)

## 🐛 Debugging

### Authentication Issues
1. Check browser console for error messages
2. Verify token in localStorage (DevTools → Application → Local Storage)
3. Check Network tab for failed API requests
4. Ensure backend is running and accessible

### Common Issues
- **CORS errors**: Configure your backend to allow requests from frontend URL
- **404 errors**: Ensure backend routes match the API calls
- **Token expiration**: Implement token refresh or handle expiration gracefully

## 🔧 Development Tips

### Adding New Features
1. Create API service in `/services`
2. Add Zustand store for state management
3. Create necessary components
4. Add routes to App.jsx
5. Implement proper error handling

Built with ❤️ using React, Tailwind CSS, and modern security practices.