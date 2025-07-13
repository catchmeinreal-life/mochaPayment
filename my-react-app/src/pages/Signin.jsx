import { useState, useEffect } from 'react';
import { Navigate, Link} from 'react-router-dom';
import { authService  } from '../services/mochaPayment';
import { ToastContainer, toast } from "react-toastify";

import '../styles/signinPage.css'; //styling

//components
import NavBar from '../components/NavBar';

function SignIn() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //greetig component
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');



  // Check if the user is already authenticated
  // This is a simple check using localStorage, in a real application you would check with your authentication service
  // and redirect to the dashboard if they are already logged in.
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

    // Check authentication status on component mount
    greetUser();
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      email,
      password,
    };
    try {
      const response = await authService.register(userData)
      toast.success(response.message);

      localStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      toast(error.message)
    }

    
    // You can also use the useNavigate hook from react-router-dom to navigate programmatically
    // const navigate = useNavigate();
    // navigate("/dashboard");
    // In a real application, you would send the username and password to your authentication service here
  };

  return (
    isAuthenticated ? (
      <Navigate to="/" replace />
    ) : (
      <>
        <NavBar/>
        <div className="signin-page">
          <div className='message'>
            <p>{ message ? message : error}</p>
          </div>
          <h1>Sign In Page</h1>
          <p>Already have an Account?<span><Link to='/login' replace>Log-In</Link></span></p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" required value={username} onChange={e => setUsername(e.target.value)} autoComplete='user123'/>
            </div>
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
        <ToastContainer />
      </>
      
    )
  );
}

export default SignIn;