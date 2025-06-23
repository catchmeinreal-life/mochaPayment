import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/** Pages 
 * Home: Public page, accessible to all users.
 * Dashboard: Protected page, accessible only to authenticated users. 
 * Login: Public page, used for user authentication.
 * PaymentForm: Public page, used for making payments. 
 * 
*/
import ProtectedRoute from "./components/ProtectedRoute";


import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PaymentForm from "./pages/PaymentForm";


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
      {/* Public routes */}
      <Route path="/" element={<Home onLogout={handleLogout} isAuthenticated={isAuthenticated} />} />
      <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} isAuthenticated={isAuthenticated} />} />
      <Route path="/payment" element={<PaymentForm onLogout={handleLogout} isAuthenticated={isAuthenticated} />} />
      <Route path="/login" element={<Login  isAuthenticated={isAuthenticated}/>} />

      
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default AppRoutes;
