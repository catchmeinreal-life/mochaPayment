import { Routes, Route, useNavigate } from "react-router-dom";

import PaymentForm from "./pages/PaymentForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";

/** Pages 
 * Home: Public page, accessible to all users.
 * Dashboard: Protected page, accessible only to authenticated users. 
 * Login: Public page, used for user authentication.
 * PaymentForm: Public page, used for making payments. 
 * 
*/
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";


function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    const onStorage = () => setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home onLogout={handleLogout} isAuthenticated={isAuthenticated} />} />
      <Route path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/payment" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <PaymentForm />
        </ProtectedRoute>
      } />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default AppRoutes;
