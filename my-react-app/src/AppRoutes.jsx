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
import Login from "./pages/Login";
import SignIn from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import PaymentForm from "./pages/PaymentForm";
import NotFound from "./pages/NotFound";


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
      <Route path="/login" element={<Login  isAuthenticated={isAuthenticated}/>} />
      <Route path="/signin" element={<SignIn  isAuthenticated={isAuthenticated}/>} />
      {/* Public routes */}
      <Route path="/" element={<Home onLogout={handleLogout} isAuthenticated={isAuthenticated} />} />
      <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} isAuthenticated={isAuthenticated} />} />
      <Route path="/payment" element={<PaymentForm onLogout={handleLogout} isAuthenticated={isAuthenticated} />} />
      <Route path="*" element={<NotFound />} />

      
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default AppRoutes;
