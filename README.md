# SecureCommerce - Secure E-commerce Platform

> A modern, secure full-stack e-commerce application built with OWASP security best practices, Auth0 authentication, and modern web technologies.

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0%2B-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)
[![Auth0](https://img.shields.io/badge/Auth0-OIDC-orange.svg)](https://auth0.com/)
[![Security](https://img.shields.io/badge/Security-OWASP%20Top%2010-red.svg)](https://owasp.org/Top10/)

## 📚 Documentation Links

- [Frontend Documentation](./frontend/README.md) - Detailed frontend setup and component documentation
- [Backend Documentation](./backend/README.md) - API documentation and backend architecture
- [Postman collection](./postman_collection.json) - API testing collection
- [Postman environments](./postman_environment.json) - Pre-configured environments for Postman


## 🎯 Overview

SecureCommerce is a comprehensive e-commerce platform designed with **security-first principles**. This project demonstrates the implementation of all OWASP Top 10 vulnerability mitigations while maintaining modern user experience standards.

### 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Frontend      │────▶│    Backend      │────▶│   Database      │
│   React + Vite  │     │  Node.js + API  │     │  MongoDB Atlas  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                        │
         │                        │
         └────────────────────────▼
                              ┌─────────────────┐
                              │                 │
                              │     Auth0       │
                              │  Authentication │
                              │                 │
                              └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Auth0 account

### 1. Clone the Repository
```bash
git clone https://github.com/Rami2212/Secured-Ecommerce.git
cd Secured-Ecommerce
```

### 2. Setup Backend
```bash
cd backend
npm install
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🛡️ Security Features

### OWASP Top 10 Compliance

| Vulnerability | Status | Implementation |
|---------------|--------|----------------|
| A01: Broken Access Control | ✅ | JWT authentication, RBAC, resource ownership validation |
| A02: Cryptographic Failures | ✅ | Environment variables, strong passwords, HTTPS |
| A03: Injection | ✅ | MongoDB sanitization, parameterized queries, input validation |
| A04: Insecure Design | ✅ | Security-by-design architecture, business logic validation |
| A05: Security Misconfiguration | ✅ | Helmet.js, secure headers, proper CORS |
| A06: Vulnerable Components | ✅ | Regular dependency updates, security audits |
| A07: Authentication Failures | ✅ | Auth0 integration, MFA ready, session management |
| A08: Software Data Integrity | ✅ | Input validation, data sanitization, integrity checks |
| A09: Security Logging | ✅ | Comprehensive logging, security event monitoring |
| A10: Server-Side Request Forgery | ✅ | URL validation, whitelist approach, input sanitization |

### Additional Security Measures
- **Rate Limiting**: Protection against brute force attacks
- **XSS Protection**: Input sanitization and CSP headers
- **CSRF Protection**: Proper token handling
- **SQL Injection Prevention**: Parameterized queries with Mongoose
- **Error Handling**: Secure error responses without information leakage

## 🛒 Features

### For Customers
- **Product Browsing**: Search and filter products by category
- **Secure Checkout**: Create orders with delivery preferences
- **Order Tracking**: View order history and status
- **Profile Management**: Update personal information
- **Dashboard**: Personal order statistics and insights

### For Administrators
- **User Management**: View and manage all users
- **Order Management**: Process and update order statuses
- **System Analytics**: Dashboard with key metrics
- **Security Monitoring**: Track authentication attempts and errors

## 📋 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login user
GET    /api/auth/profile        # Get user profile
PUT    /api/auth/profile        # Update user profile
POST   /api/auth/logout         # Logout user
```

### Product Endpoints
```
GET    /api/products            # Get all products (paginated)
GET    /api/products/search     # Search products
GET    /api/products/categories # Get categories
GET    /api/products/:id        # Get product by ID
POST   /api/products            # Create product (Admin)
PUT    /api/products/:id        # Update product (Admin)
DELETE /api/products/:id        # Delete product (Admin)
```

### Order Endpoints
```
POST   /api/orders              # Create new order
GET    /api/orders/my-orders    # Get user orders
GET    /api/orders/:id          # Get order by ID
PUT    /api/orders/:id          # Update order
PATCH  /api/orders/:id/cancel   # Cancel order
GET    /api/orders              # Get all orders (Admin)
PATCH  /api/orders/:id/status   # Update order status (Admin)
```

### User Management Endpoints
```
GET    /api/users/dashboard     # Get user dashboard data
GET    /api/users/all           # Get all users (Admin)
GET    /api/users/:id           # Get user by ID (Admin)
PATCH  /api/users/:id/status    # Update user status (Admin)
```

## 🏗️ Project Structure

```
SecureCommerce/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── product/      # Product components
│   │   │   └── ui/           # Basic UI components
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # Application pages
│   │   │   ├── auth/         # Auth pages
│   │   │   ├── user/         # User dashboard
│   │   │   └── admin/        # Admin panel
│   │   ├── services/         # API service files
│   │   ├── stores/           # Zustand state management
│   │   └── lib/              # Utility libraries
│   ├── package.json
│   └── README.md             # Frontend-specific documentation
│
├── backend/                   # Node.js backend API
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Custom middleware
│   │   ├── models/           # Mongoose models
│   │   └── routes/           # Express routes
│   ├── server.js            # Main server file
│   ├── package.json
│   └── README.md            # Backend-specific documentation
│
├── docs/                     # Documentation
├── .gitignore
├── LICENSE
└── README.md                # This file
```

## 🔧 Technology Stack

### Frontend
- **React 18** - UI framework with hooks
- **Vite** - Fast build tool and dev server
- **React Router Dom** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **Auth0** - Authentication service
- **JWT** - Token-based authentication
- **Helmet** - Security headers
- **Express Validator** - Input validation
- **Morgan** - Request logging

## 🔒 Environment Configuration

### Frontend (.env)
```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-api-audience

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=SecureCommerce
VITE_APP_VERSION=1.0.0
```

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your-mongodb-atlas-uri

# Auth0 Configuration
AUTH0_DOMAIN=https://your-domain.auth0.com/
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-api-audience

# JWT Configuration
JWT_SECRET=your-jwt-secret

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## 🐛 Troubleshooting

### Common Issues

**Authentication Issues**
- Verify Auth0 configuration in both frontend and backend
- Check token expiration and refresh mechanisms
- Ensure CORS settings allow authentication headers

**Database Connection**
- Verify MongoDB Atlas connection string
- Check network access settings in MongoDB Atlas
- Ensure proper firewall configurations

**API Errors**
- Check backend server is running on correct port
- Verify API base URL in frontend configuration
- Check for proper error handling and status codes

**Built with ❤️ and a commitment to security**

*SecureCommerce - Where security meets usability in modern e-commerce.*