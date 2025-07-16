import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { authService } from '../services/mochaPayment';
import NavBar from '../components/NavBar';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/signinPage.css';
import '../styles/global.css';

function SignIn({ isAuthenticated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const userData = {
      username,
      email,
      password,
    };
    
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        toast.success(`🎉 Welcome ${response.data.user.username}! You've received ${response.data.wallet.balance}!`);
        
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'));
        
        // Navigate to dashboard after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isAuthenticated ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <>
        <NavBar isAuthenticated={isAuthenticated} />
        <div className="signin-page">
          <div className="message">
            <p>{message}</p>
          </div>
          <h1>Join MochaPay</h1>
          <p>Already have an account? <span><Link to='/login'>Login</Link></span></p>
          
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                required 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
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
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up & Get 3 MochaCoins'}
            </button>
          </form>
        </div>
        <ToastContainer />
      </>
    )
  );
}

export default SignIn;