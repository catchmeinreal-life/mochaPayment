# MochaPayment System

MochaPayment is a full-stack demo application featuring a Node.js/Express backend and a React frontend. It demonstrates basic authentication, protected routes, and a simple payment form.

## Features
- User authentication (demo, localStorage-based)
- Protected dashboard and payment routes
- React frontend with navigation
- Express backend serving static and API routes

## 🚀 Getting Started

Welcome to the MochaPayment ecosystem.

### 🔐 1. Authentication Flow
- **Login Endpoint:** Users authenticate via `/api/auth/login` using valid credentials or OAuth (Google/GitHub).
- **Token Issuance:** Upon successful login, the server responds with an encrypted JWT token stored in HTTP-only cookies or localStorage.
- **Session Validation:** Protected endpoints validate the token on each request using middleware to ensure secure access.

### 🧭 2. User Actions Post-Login
Once authenticated, users can:
- Access their dashboard with `/api/user/profile`.
- Perform wallet operations like deposits, withdrawals, or transaction history (`/api/wallet`, `/api/transactions`).
- Update personal settings via `/api/user/update`.

### 🚪 3. Logout Flow
- **Logout Endpoint:** When a user hits `/api/auth/logout`, the session token is invalidated and cleared from storage.
- **Redirect or Confirmation:** Users are optionally redirected to the login screen or receive a logout confirmation.

---


### Prerequisites
- Node.js (v16+ recommended)
- npm

### Installation
1. Clone the repository or download the source code.
2. Install backend dependencies:
   ```sh
   npm install
   ```
3. Install frontend dependencies:
   ```sh
   cd my-react-app
   npm install
   ```

### Running the App
#### Start the Express backend:
```sh
npm start
```

#### Start the React frontend (in a separate terminal):
```sh
cd my-react-app
npm run dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## Usage
- Visit `/login` to log in (any credentials work in demo mode).
- Access `/dashboard` and `/payment` after logging in.
- Use the navigation bar to move between pages.
- Click "Logout" to end your session.

## Project Structure
- `server.js` - Express backend server
- `my-react-app/` - React frontend app
- `src/pages/` - React pages (Home, Login, Dashboard, PaymentForm)
- `src/components/ProtectedRoute.jsx` - Route protection logic

## License
This project is for demo and educational purposes.
