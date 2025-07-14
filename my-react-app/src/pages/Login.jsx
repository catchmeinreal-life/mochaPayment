import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import NavBar from '../components/NavBar';
import { authService } from '../services/mochaPayment';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';
import '../styles/global.css';

function Login({ isAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const greetUser = async () => {
      try {
        const response = await authService.signIn();
        setMessage(response.message);
      } catch (error) {
        console.error('Error fetching welcome message:', error);
      }
    };
    greetUser();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        toast.success(`Welcome back, ${response.user.username}!`);
        
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'));
        
        // Navigate to dashboard after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already authenticated, redirect to dashboard
  return (
    isAuthenticated ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <>
        <NavBar isAuthenticated={isAuthenticated} />
        <div className="login-page">
          <h1>Login to MochaPay</h1>
          <div className="message">
            <p>{message}</p>
          </div>
          <p>Don't have an account? <span><Link to='/signin'>Sign Up</Link></span></p>
          
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    )
  );
}

export default Login;