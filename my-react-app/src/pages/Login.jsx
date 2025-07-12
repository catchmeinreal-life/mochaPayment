import { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';

import { authService  } from '../services/mochaPayment';
import { ToastContainer, toast } from "react-toastify";

//components
import NavBar from '../components/NavBar';
import '../styles/login.css'; //styling

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //greetig component
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const navigate = useNavigate();



  // Check if the user is already authenticated
  // This is a simple check using localStorage, in a real application you would check with your authentication service
  // and redirect to the dashboard if they are already logged in.
  
  
  useEffect(() => {
    const greetUser = async () => {
      try {
        const response = await authService.signIn();
        setMessage(response.data.message);
      } catch (error) {
        setError(error.message)
      }
    }

    // Check authentication status on component mount
   
    greetUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      password
    };
    try {
      const response = await authService.login(userData)
      toast.success(response.message, {
      });
      // setIsAuthenticated(true)/;
      localStorage.setItem("isAuthenticated", "true");
      navigate('/');

    } catch (error) {
      toast(error.message)
    }
    // Simple demo: accept any username/password
    // Redirect to dashboard after successful login

    
    // You can also use the useNavigate hook from react-router-dom to navigate programmatically
    // const navigate = useNavigate();
    // navigate("/dashboard");
    // In a real application, you would send the username and password to your authentication service here
  };
  //  if (isAuthenticated) {
  //    // automatic redirect
  //   return null;
  // }

  return (
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
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
        <ToastContainer />
      </>
  );
}

export default Login;