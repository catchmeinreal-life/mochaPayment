# MochaPayment System

MochaPayment is a full-stack demo application featuring a Node.js/Express backend and a React frontend. It demonstrates basic authentication, protected routes, and a simple payment form.

## Features
- User authentication (demo, localStorage-based)
- Protected dashboard and payment routes
- React frontend with navigation
- Express backend serving static and API routes

## Getting Started

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
- Frontend: http://localhost:5173 (or as shown in your terminal)

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

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
