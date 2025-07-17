# MochaPayment System

MochaPayment is a full-stack digital payment application built with Node.js/Express backend and React frontend. It features user authentication, wallet management, and secure MochaCoin transfers with MongoDB persistence.

## 🚀 Features

### Authentication & Security
- JWT-based user authentication
- Secure password hashing with bcrypt
- Protected API routes with middleware
- Role-based access control (user, admin, partner)

### Wallet Management
- Digital wallet with MochaCoin currency
- Real-time balance tracking
- Secure fund transfers between users
- Transaction history with pagination

### User Experience
- Responsive React frontend with modern UI
- Real-time transaction updates
- Quick amount selection for transfers
- Comprehensive dashboard with account overview

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with 2-hour expiration
- **Security**: CORS, input validation, error handling
- **Models**: User, Wallet, Transaction with proper relationships

### Frontend (React)
- **Routing**: React Router with protected routes
- **State Management**: React hooks and localStorage
- **HTTP Client**: Axios with interceptors
- **UI**: Custom CSS with responsive design
- **Notifications**: React Toastify for user feedback

## 📁 Project Structure

```
MochaPayment/
├── server/                     # Backend application
│   ├── src/
│   │   ├── config/            # Database and configuration
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Authentication middleware
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API route definitions
│   │   └── utils/            # Utility functions
│   ├── views/                # Static HTML pages
│   ├── public/               # Static assets
│   └── server.js             # Main server file
├── my-react-app/              # Frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── styles/          # CSS stylesheets
│   └── index.html           # Main HTML template
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Environment Variables
Create a `.env` file in the server directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/mochapay

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# New User Rewards
NEW_USER_COINS=3

# Admin Account (for initial setup)
ADMIN_ACCOUNT_ID=MC_ADMIN_001
ADMIN_ACCOUNT_USERNAME=admin
ADMIN_ACCOUNT_EMAIL=admin@mochapay.com
ADMIN_ACCOUNT_PASS=admin123
ADMIN_ACCOUNT_ROLE=admin
ADMIN_INITIAL_BALANCE=1000000

# Partner Account (for initial setup)
PARTNER_ACCOUNT_ID=MC_PARTNER_001
PARTNER_ACCOUNT_USERNAME=partner
PARTNER_ACCOUNT_EMAIL=partner@mochapay.com
PARTNER_ACCOUNT_PASS=partner123
PARTNER_ACCOUNT_ROLE=partner
PARTNER_INITIAL_BALANCE=500000

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the React app directory:
   ```bash
   cd my-react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file (optional):
   ```bash
   # .env
   VITE_MOCHA_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)
- `GET /message` - Welcome message
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /verify/:token` - Token verification

### Wallet Routes (`/api/wallet`) - Protected
- `GET /balance` - Get wallet balance
- `POST /transfer` - Transfer MochaCoins
- `GET /transactions` - Get transaction history

### Health Check
- `GET /api/health` - API health status

## 💰 MochaCoin System

### Initial Allocation
- New users receive 3 MochaCoins upon registration
- Coins are allocated from admin/partner accounts
- All transactions are recorded in the database

### Transfer Process
1. Validate sender has sufficient balance
2. Verify recipient account exists
3. Create pending transaction record
4. Execute balance updates atomically
5. Update transaction status to completed

## 🔐 Authentication Flow

### Registration
1. User provides username, email, password
2. System validates input and checks for duplicates
3. Password is hashed using bcrypt
4. User account and wallet are created
5. Initial MochaCoins are allocated
6. JWT token is issued

### Login
1. User provides email and password
2. System validates credentials
3. JWT token is issued with 2-hour expiration
4. User data is returned (excluding password)

### Protected Routes
1. Client sends JWT token in Authorization header
2. Middleware verifies token validity
3. User object is attached to request
4. Route handler processes authenticated request

## 🎨 Frontend Features

### Pages
- **Home**: Landing page with account overview
- **Login/Signup**: Authentication forms
- **Dashboard**: User account summary and recent transactions
- **Payment**: Transfer form with quick amount selection
- **404**: Custom not found page

### Components
- **NavBar**: Responsive navigation with auth state
- **ProtectedRoute**: Route protection wrapper
- **PaymentForm**: Legacy payment component

### Responsive Design
- Mobile-first approach
- Flexible grid system
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🚀 Usage

1. **Registration**: Visit `/signin` to create a new account
2. **Login**: Use `/login` with your credentials
3. **Dashboard**: View your account summary at `/dashboard`
4. **Send Money**: Use `/payment` to transfer MochaCoins
5. **Navigation**: Use the responsive navbar to move between pages

### Demo Accounts
After running the server, these accounts are automatically created:
- **Admin**: admin@mochapay.com / admin123
- **Partner**: partner@mochapay.com / partner123

## 🔧 Development

### Backend Development
```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd my-react-app
npm run dev  # Vite development server
```

### Database Seeding
Prime users (admin/partner) are automatically seeded on server startup.

## 📱 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🛡️ Security Features
- Password hashing with bcrypt (12 salt rounds)
- JWT token expiration (2 hours)
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Error handling without sensitive data exposure

## 🚀 Deployment Considerations
- Set `NODE_ENV=production` for production builds
- Use environment variables for all sensitive data
- Configure CORS for production domains
- Set up MongoDB Atlas for cloud database
- Use HTTPS in production

## 📄 License
This project is for educational and demonstration purposes.

## 🤝 Contributing
This is a demo application. For educational purposes, feel free to fork and experiment with the codebase.