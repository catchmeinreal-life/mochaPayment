import { useState, useEffect } from 'react';
import { Navigate, Link} from 'react-router-dom';

import { authService  } from '../services/mochaPayment';

//components
import NavBar from '../components/NavBar';
import '../styles/login.css'; //styling

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  useEffect(() => {
    const greetUser = async () => {
      try {
        const response = await authService.signIn();
        setMessage(response.data.message);
      } catch (error) {
        setError(error.message)
      }
    }
    greetUser();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("isAuthenticated", "true");
    window.location.replace("/dashboard");
    window.location.pathname = "/dashboard";
  };

  return (
    isAuthenticated ? (
      <Navigate to="/" replace />
    ) : (
      <>
        <NavBar/>
        <div className="login-page">
          <div className="message">
            <p>{ message ? message : error}</p>
          </div>
          <h1>Login Page</h1>
          <p>Register an Account?<span><Link to='/signin' replace>Sign-In</Link></span></p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" required value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </>
      
    )
  );
}

export default Login;