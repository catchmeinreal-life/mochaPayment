import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { authService } from '../services/mochaPayment';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function Login({ isAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
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
    <>
     { isAuthenticated ? <navigate to="/" /> :
      <div>
        <NavBar />
        <h1>Login Page</h1>

        <p>Already have an Account? <span><Link to="/signin" replace>Register</Link></span></p>
        <form className='login-form' onSubmit={handleLogin}>

          <div className='form-group'>
            <label htmlFor="email">Email:</label>
            <input type="text" placeholder="Email" autoComplete='user@mail.com' 
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>

          <div className='form-group'>
            <label htmlFor="password">Password:</label>
            <input type="password" placeholder="Password" autoComplete='current-password'
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          <button type="submit">Login</button>
        </form>
        <ToastContainer />
      </div>
     }
    </>
  );
}

export default Login;