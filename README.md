# 🛒 E-Commerce MERN Stack Application

A modern, full-featured e-commerce platform built with MongoDB, Express.js, React, and Node.js (MERN Stack) with TypeScript.

## 🚀 Live Demo

- **Frontend:** [https://app-ecommerce-webapp.netlify.app](https://app-ecommerce-webapp.netlify.app)
- **Backend API:** [https://e-commerce-backend-hmx2.onrender.com](https://e-commerce-backend-hmx2.onrender.com)

## ✨ Features

### 🛍️ Customer Features
- 🔐 Google OAuth Authentication
- 🔍 Advanced Product Search & Filters
- 🛒 Shopping Cart Management
- 💳 Secure Stripe Payment Integration
- 📦 Order Tracking & History
- ⭐ Product Reviews & Ratings
- 🎟️ Discount Coupon Application

### 👨‍💼 Admin Dashboard
- 📊 Real-time Analytics & Charts
- 📦 Product Management (CRUD)
- 🖼️ Multi-Image Upload (Cloudinary)
- 📋 Order Management
- 👥 User Management
- 🎫 Coupon Management
- 📈 Revenue & Sales Reports

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Redux Toolkit** & **RTK Query**
- **React Router v6**
- **Sass/SCSS**
- **Chart.js** for data visualization
- **Firebase** for authentication
- **Stripe.js** for payments
- **Vite** for build tool

### Backend
- **Node.js** & **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **Stripe API** for payments
- **Cloudinary** for image storage
- **JWT** for authentication

### Deployment
- **Frontend:** Netlify
- **Backend:** Render
- **Database:** MongoDB Atlas

## 📁 Project Structure

```
e-commerce/
├── e-commerce-frontend/       # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Route pages
│   │   ├── redux/           # State management
│   │   ├── styles/          # SCSS styles
│   │   └── types/           # TypeScript types
│   └── package.json
│
└── e-commerce-backend/       # Node.js backend API
    ├── src/
    │   ├── controllers/     # Route controllers
    │   ├── models/          # Database models
    │   ├── routes/          # API routes
    │   ├── middlewares/     # Express middlewares
    │   └── utils/           # Helper functions
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn
- Stripe account
- Firebase account
- Cloudinary account

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/SatishMhobiya/e-commerce.git
cd e-commerce
```

#### 2. Backend Setup
```bash
cd e-commerce-backend
npm install
```

Create `.env` file in `e-commerce-backend/`:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start backend server:
```bash
npm run dev
```

#### 3. Frontend Setup
```bash
cd e-commerce-frontend
npm install
```

Create `.env` file in `e-commerce-frontend/`:
```env
VITE_SERVER=http://localhost:4000
VITE_FIREBASE_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_APP_ID=your_firebase_app_id
VITE_STRIPE_KEY=your_stripe_publishable_key
```

Start frontend development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📚 API Documentation

### Base URL
```
Production: https://e-commerce-backend-hmx2.onrender.com
Development: http://localhost:4000
```

### Main Endpoints

#### User Routes
- `POST /api/v1/user/new` - Create user
- `GET /api/v1/user/all` - Get all users (Admin)
- `GET /api/v1/user/:id` - Get user details
- `DELETE /api/v1/user/:id` - Delete user (Admin)

#### Product Routes
- `GET /api/v1/product/latest` - Latest products
- `GET /api/v1/product/all` - Search products
- `GET /api/v1/product/categories` - All categories
- `GET /api/v1/product/:id` - Product details
- `POST /api/v1/product/new` - Create product (Admin)
- `PUT /api/v1/product/:id` - Update product (Admin)
- `DELETE /api/v1/product/:id` - Delete product (Admin)

#### Order Routes
- `POST /api/v1/order/new` - Create order
- `GET /api/v1/order/my` - User's orders
- `GET /api/v1/order/all` - All orders (Admin)
- `GET /api/v1/order/:id` - Order details
- `PUT /api/v1/order/:id` - Update order (Admin)
- `DELETE /api/v1/order/:id` - Delete order (Admin)

#### Payment Routes
- `POST /api/v1/payment/create` - Create payment
- `POST /api/v1/payment/coupon/new` - Create coupon (Admin)
- `GET /api/v1/payment/coupon/all` - All coupons (Admin)
- `GET /api/v1/payment/discount` - Apply coupon

#### Dashboard Routes (Admin)
- `GET /api/v1/dashboard/stats` - Statistics
- `GET /api/v1/dashboard/pie` - Pie chart data
- `GET /api/v1/dashboard/bar` - Bar chart data
- `GET /api/v1/dashboard/line` - Line chart data

## 🔐 Environment Variables

### Backend Variables
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `MONGO_URI` | MongoDB connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `CORS_ORIGIN` | Allowed origins (comma-separated) |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend Variables
| Variable | Description |
|----------|-------------|
| `VITE_SERVER` | Backend API URL |
| `VITE_FIREBASE_KEY` | Firebase API key |
| `VITE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_PROJECT_ID` | Firebase project ID |
| `VITE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_MESSAGING_SENDER_ID` | Firebase messaging ID |
| `VITE_APP_ID` | Firebase app ID |
| `VITE_STRIPE_KEY` | Stripe publishable key |

## 🎨 Screenshots

### Customer Interface
![Home Page](https://via.placeholder.com/800x400?text=Home+Page)
![Product Details](https://via.placeholder.com/800x400?text=Product+Details)
![Shopping Cart](https://via.placeholder.com/800x400?text=Shopping+Cart)

### Admin Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard)
![Product Management](https://via.placeholder.com/800x400?text=Product+Management)
![Analytics](https://via.placeholder.com/800x400?text=Analytics+Charts)

## 🧪 Testing

### Using Stripe Test Cards
For testing payments, use these test card numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002

Use any future expiry date, any 3-digit CVC, and any 5-digit ZIP code.

## 📝 Scripts

### Backend
```bash
npm run dev        # Start development server
npm run build      # Build TypeScript
npm start          # Start production server
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is for educational and portfolio purposes.

## 👤 Author

**Satish Mhobiya**

- GitHub: [@SatishMhobiya](https://github.com/SatishMhobiya)

## 🌟 Show Your Support

Give a ⭐️ if you like this project!

## 📞 Contact

For any inquiries or collaboration opportunities, feel free to reach out!

---

**Built with ❤️ using MERN Stack**

