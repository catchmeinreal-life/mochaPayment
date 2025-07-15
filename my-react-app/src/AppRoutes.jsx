import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "./services/mochaPayment";

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
    // Check authentication status on mount
    const checkAuth = async () => {
      const isAuth = await authService.checkIsAuthenticated();
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
    
    // Listen for storage changes (login/logout from other tabs)
    const onStorage = () => {
      const isAuth = authService.checkIsAuthenticated();
      setIsAuthenticated(isAuth);
    };
    
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
    
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<Login isAuthenticated={isAuthenticated} />} />
      <Route path="/signin" element={<SignIn isAuthenticated={isAuthenticated} />} />
      
      {/* Public routes */}
      <Route path="/" element={<Home onLogout={handleLogout} isAuthenticated={isAuthenticated} />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard onLogout={handleLogout} isAuthenticated={isAuthenticated} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PaymentForm onLogout={handleLogout} isAuthenticated={isAuthenticated} />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
