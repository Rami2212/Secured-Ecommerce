# Secure E-commerce Backend

A secure MERN stack e-commerce backend with Auth0 integration, built for the Assessment 2 requirements.

## Features

- 🔐 **Auth0 Integration** - OIDC authentication and authorization
- 🛡️ **OWASP Top 10 Security** - Protection against common vulnerabilities
- 🗄️ **MongoDB Atlas** - Cloud database integration
- 📦 **Product Management** - CRUD operations for products
- 🛒 **Order Management** - Complete order lifecycle management
- 👤 **User Management** - Profile management and access control
- 🔑 **JWT Authentication** - Secure API access
- 📊 **Input Validation** - Comprehensive data validation
- 🚀 **Rate Limiting** - Protection against abuse
- 📝 **Logging** - Request logging and error tracking

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Auth0 (OIDC)
- **Security**: Helmet, CORS, Rate Limiting, Input Sanitization
- **Validation**: Express Validator
- **ODM**: Mongoose

## Security Features (OWASP Top 10 Mitigations)

1. **Injection Prevention** - MongoDB sanitization and parameterized queries
2. **Broken Authentication** - Auth0 integration with JWT tokens
3. **Sensitive Data Exposure** - Environment variables for secrets
4. **XML External Entities (XXE)** - No XML parsing
5. **Broken Access Control** - Role-based access control and ownership validation
6. **Security Misconfiguration** - Secure headers with Helmet
7. **Cross-Site Scripting (XSS)** - Input sanitization and validation
8. **Insecure Deserialization** - JSON parsing with size limits
9. **Components with Known Vulnerabilities** - Regular dependency updates
10. **Insufficient Logging & Monitoring** - Request logging and error tracking

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Auth0 account

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd secure-ecommerce-backend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/secure-ecommerce?retryWrites=true&w=majority

# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://your-api-identifier

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address
5. Get the connection string and update `MONGODB_URI` in `.env`

### 4. Auth0 Setup

1. Create an Auth0 account at [https://auth0.com](https://auth0.com)
2. Create a new Application (Single Page Application)
3. Create a new API
4. Configure the following settings:

**Application Settings:**
- Allowed Callback URLs: `http://localhost:3000/callback`
- Allowed Logout URLs: `http://localhost:3000`
- Allowed Web Origins: `http://localhost:3000`

**API Settings:**
- Enable RBAC
- Add Permissions in Token

5. Update the `.env` file with your Auth0 credentials

### 5. Database Initialization

Run the application to automatically create database indexes:

```bash
npm run dev
```

### 6. Seed Data (Optional)

You can create sample products by making POST requests to `/api/products` endpoint with admin credentials.

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `POST /logout` - Logout user
- `POST /refresh-token` - Refresh access token
- `POST /forgot-password` - Request password reset

### User Routes (`/api/users`)
- `GET /dashboard` - Get user dashboard data
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /orders-summary` - Get user orders summary
- `PATCH /deactivate` - Deactivate user account
- `GET /all` - Get all users (Admin only)
- `GET /:userId` - Get user by ID (Admin only)
- `PATCH /:userId/status` - Update user status (Admin only)

### Product Routes (`/api/products`)
- `GET /` - Get all products with pagination
- `GET /search` - Search products
- `GET /categories` - Get product categories
- `GET /featured` - Get featured products
- `GET /:productId` - Get product by ID
- `POST /` - Create product (Admin only)
- `PUT /:productId` - Update product (Admin only)
- `DELETE /:productId` - Delete product (Admin only)
- `PATCH /:productId/stock` - Update product stock (Admin only)

### Order Routes (`/api/orders`)
- `POST /` - Create new order
- `GET /my-orders` - Get user orders
- `GET /upcoming` - Get upcoming orders
- `GET /past` - Get past orders
- `GET /delivery-locations` - Get delivery locations
- `GET /delivery-times` - Get delivery times
- `GET /:orderId` - Get order by ID
- `PUT /:orderId` - Update order
- `PATCH /:orderId/cancel` - Cancel order
- `GET /` - Get all orders (Admin only)
- `PATCH /:orderId/status` - Update order status (Admin only)
- `GET /admin/statistics` - Get order statistics (Admin only)

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## Project Structure

```
src/
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # Mongoose models
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/              # Express routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── .env                 # Environment variables
├── server.js            # Main server file
└── package.json         # Dependencies and scripts
```

## Testing

Run tests with:
```bash
npm test
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` file to version control
2. **HTTPS**: Use HTTPS in production
3. **Input Validation**: All inputs are validated and sanitized
4. **Rate Limiting**: API endpoints are rate limited
5. **CORS**: Properly configured CORS policy
6. **Headers**: Security headers set with Helmet
7. **Authentication**: JWT tokens with proper expiration
8. **Access Control**: Role-based access control implemented

## Error Handling

The application includes comprehensive error handling:
- Validation errors return 400 with detailed messages
- Authentication errors return 401
- Authorization errors return 403
- Not found errors return 404
- Server errors return 500 with sanitized messages

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure security best practices

## License

This project is licensed under the MIT License.