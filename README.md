# 🛒 E-Commerce API

A robust and feature-rich RESTful API for e-commerce applications built with Node.js, Express, and MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen?style=for-the-badge&logo=render)](https://your-app-name.onrender.com)
[![API Status](https://img.shields.io/badge/API%20Status-Online-success?style=for-the-badge)](https://your-app-name.onrender.com/api/v1)

## 🌐 Live Demo

🚀 **[Live API](https://ecommerce-rest-api-bmw6.onrender.com/)** - Experience the API in action

📖 **[API Documentation](https://ecommerce-rest-api-bmw6.onrender.com/api-docs)** - Interactive documentation and testing interface

📄 **[Postman Collection](https://ecommerce-rest-api-bmw6.onrender.com/ECommerceAPI.json)** - Ready-to-use Postman collection


### Quick Test
Try the API instantly:
```bash
# Get all products
curl https://ecommerce-rest-api-bmw6.onrender.com/api/v1/products

# Register a new user
curl -X POST  https://ecommerce-rest-api-bmw6.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

---

## ✨ Features

- 🔐 **Authentication & Authorization** - JWT-based auth with secure cookie handling
- 👥 **User Management** - Registration, login, profile management, and role-based access
- 📦 **Product Management** - CRUD operations for products with image upload
- ⭐ **Review System** - Users can rate and review products
- 🛍️ **Order Processing** - Complete order management with status tracking
- 🔒 **Security** - Rate limiting, XSS protection, MongoDB injection prevention
- 📁 **File Upload** - Secure image upload for product images
- 📊 **Data Validation** - Comprehensive input validation with Joi
- 🔄 **Error Handling** - Centralized error handling with custom error classes

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Validation:** Joi
- **Security:** Helmet, CORS, XSS Protection, Rate Limiting
- **File Upload:** Express File Upload
- **Email:** Nodemailer
- **Development:** Nodemon

---

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

---

## ⚡ Quick Start

> 💡 **Want to test immediately?** Check out our [live demo](https://your-app-name.onrender.com) or download the [Postman collection](https://your-app-name.onrender.com/ECommerceAPI.json)

### 1. Clone the repository
```bash
git clone https://github.com/CodingWithSanjeet/ecommerce-rest-api.git
cd ecommerce-rest-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/ecom-api

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_LIFETIME=30d

# Server
PORT=3000
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Start the development server
```bash
npm start
```

The API will be running at `http://localhost:3000`

---

## 📚 API Documentation

### Base URL

**Local Development:**
```
http://localhost:3000/api/v1
```

**Live Production:**
```
https://your-app-name.onrender.com/api/v1
```

### 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |

### 👥 User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users (Admin only) | ✅ |
| GET | `/users/profile` | Get current user profile | ✅ |
| PATCH | `/users/profile` | Update user profile | ✅ |
| PATCH | `/users/change-password` | Change password | ✅ |

### 📦 Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | ❌ |
| GET | `/products/:id` | Get single product | ❌ |
| POST | `/products` | Create product (Admin only) | ✅ |
| PATCH | `/products/:id` | Update product (Admin only) | ✅ |
| DELETE | `/products/:id` | Delete product (Admin only) | ✅ |
| POST | `/products/upload-image` | Upload product image | ✅ |

### ⭐ Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reviews` | Get all reviews | ❌ |
| GET | `/reviews/:id` | Get single review | ❌ |
| POST | `/reviews` | Create review | ✅ |
| PATCH | `/reviews/:id` | Update review (Owner only) | ✅ |
| DELETE | `/reviews/:id` | Delete review (Owner only) | ✅ |

### 🛍️ Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/orders` | Get all orders (Admin only) | ✅ |
| GET | `/orders/my-orders` | Get current user orders | ✅ |
| GET | `/orders/:id` | Get single order | ✅ |
| POST | `/orders` | Create order | ✅ |
| PATCH | `/orders/:id` | Update order | ✅ |

---

## 📝 Request Examples

### Register User
```json
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Product
```json
POST /api/v1/products
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Wireless Headphones",
  "price": 99.99,
  "description": "High-quality wireless headphones",
  "category": "electronics",
  "company": "techcorp",
  "colors": ["black", "white"],
  "featured": true,
  "freeShipping": true,
  "inventory": 50
}
```

### Create Order
```json
POST /api/v1/orders
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "tax": 8.99,
  "shippingFee": 5.99,
  "orderItems": [
    {
      "name": "Wireless Headphones",
      "image": "/uploads/headphones.jpg",
      "price": 99.99,
      "amount": 2,
      "product": "64f8a9b2c1d2e3f4a5b6c7d8"
    }
  ]
}
```

---

## 📁 Project Structure

```
ecom-api/
├── controller/          # Route controllers
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── reviewController.js
│   └── orderController.js
├── models/              # Mongoose models
│   ├── User.js
│   ├── Product.js
│   ├── Review.js
│   └── Order.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── reviewRoutes.js
│   └── orderRoutes.js
├── middleware/          # Custom middleware
│   ├── authentication.js
│   ├── error-handler.js
│   └── not-found.js
├── errors/              # Custom error classes
│   ├── AppError.js
│   ├── BadRequestError.js
│   ├── NotFoundError.js
│   ├── UnauthenticatedError.js
│   └── UnauthorizedError.js
├── utils/               # Utility functions
│   ├── asyncWrapper.js
│   ├── jwt.js
│   └── index.js
├── db/                  # Database connection
│   └── connect.js
├── public/              # Static files
│   └── uploads/         # Uploaded images
├── app.js               # App configuration
├── package.json
└── README.md
```

---

## 🔒 Security Features

- **Rate Limiting**: Prevents brute force attacks
- **Helmet**: Sets various HTTP security headers
- **XSS Protection**: Prevents cross-site scripting attacks
- **MongoDB Injection**: Sanitizes user input
- **CORS**: Configures cross-origin resource sharing
- **JWT**: Secure token-based authentication
- **Password Hashing**: Uses bcrypt for password security

---

## 🧪 Testing

```bash
# Run tests (if implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecom-api
JWT_SECRET=your-super-secure-production-secret
PORT=3000
```

### Deploy to Render

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Settings**
   - **Name:** your-app-name
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecom-api
   JWT_SECRET=your-super-secure-production-secret
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - Your API will be available at `https://your-app-name.onrender.com`

### Alternative: Deploy to Heroku
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your-mongo-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@CodingWithSanjeet](https://github.com/CodingWithSanjeet)
- LinkedIn: [Sanjeet Kumar](https://www.linkedin.com/in/sanjeet-kumar-5a33b77b/)
- Email: sanjeet.kumar.nitt@gmail.com

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication

---

<div align="center">
  <h3>⭐ Star this repo if you found it helpful!</h3>
</div> 
