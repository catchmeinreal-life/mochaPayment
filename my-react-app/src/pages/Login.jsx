import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
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
    isAuthenticated ? (
      <Navigate to="/" replace />
    ) : (
      <>
        <NavBar isAuthenticated={isAuthenticated} />
        <div className="login-page">
          <div className="message">
            <p>{ message ? message : error}</p>
          </div>
       </div>
    </>
  )
)
}

export default Login;