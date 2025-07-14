import React from 'react';
import { useNavigate, Navigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

import { authService } from '../services/mochaPayment';

import '../styles/login.css'; //styling
import '../styles/global.css';
import '../styles/login.css';

function Login({ isAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
      const greetUser = async () => {
        try {
          const response = await authService.signIn();
          setMessage(response.data.message);
        } catch (error) {
          setError(error.message)
        }
      }
      greetUser(); // on componet mount 
    }, []);



  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setMessage(response.message);
      console.log("Login response:", response.message);
      // if (response.success) {
      //   localStorage.setItem("isAuthenticated", "true");
      //   navigate("/");
      // } else {
      //   // Handle login failure
      // }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };


  // If the user is already authenticated, redirect to home
  return (
    isAuthenticated ? (
      <Navigate to="/" replace />
    ) : (
      <>
        <NavBar isAuthenticated={isAuthenticated} />
        <div className="login-page">
          <h1>Login In Page</h1>
          <div className="message">
            <p>{ message ? message : error}</p>
          </div>
          <p>don't have an Account?<span><Link to='/signin' replace>Sign-In</Link></span></p>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete='user@email.com'/>
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete='password' />
            </div>
            
            <button type="submit">Sign-In</button>
          </form>
       </div>
    </>
  )
)
}

export default Login;