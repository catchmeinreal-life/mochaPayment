import { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';

import { authService  } from '../services/mochaPayment';
import { ToastContainer, toast } from "react-toastify";

import NavBar from '../components/NavBar';
import '../styles/login.css'; //styling

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const navigate = useNavigate();

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

    } catch (error) {
      toast(error.message)
    }
    

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
}

export default Login;