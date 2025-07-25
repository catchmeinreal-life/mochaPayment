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
        const response = await authService.greetUser();
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
        toast.success(`Welcome back, ${response.data.user.username}!`);
        
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'));
        
        // Navigate to dashboard after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(response.message || 'Login failed, Invalid credentials.');
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      setEmail("");
      setPassword("");
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
        <div className="login-page"> {/**login page */}

          <h1 className="heading">Login to MochaPay</h1>
          <div className="msg-info">
            <p className='msg'>{message}</p> {/**message */}
          </div>
          <div className="google-auth">
            <h3><a href="">Continue with Google</a></h3>
          </div>

          <h3>or</h3>         
          
          <form onSubmit={handleLogin}>
            <div className="input-cont">
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
            <div className="input-cont">
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
            <div className="btn-cont">
              <button className='btn-login' type="submit"     disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div> 
          </form>

          <div className="features create">
            <p>no Account?<span><Link to='/signin'>create one</Link></span></p>
          </div>

          <div className="features reset-pswd">
            <p><span><Link to='/signin'>forgot password?</Link></span></p>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    )
  );
}

export default Login;