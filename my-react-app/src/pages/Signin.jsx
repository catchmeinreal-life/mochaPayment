import { useState, useEffect } from 'react';
import { Navigate, Link} from 'react-router-dom';
import { authService  } from '../services/mochaPayment';

import '../styles/signinPage.css'; //styling
import '../styles/global.css';

//components
import NavBar from '../components/NavBar';

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple demo: accept any username/password
    localStorage.setItem("isAuthenticated", "true");
    // Redirect to dashboard after successful login
    window.location.replace("/dashboard");
    window.location.pathname = "/dashboard";

    
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
        <NavBar isAuthenticated={isAuthenticated} />
        <div className="signin-page">
          <div className='message'>
            <p>{ message ? message : error}</p>
          </div>
          <h1>Sign In Page</h1>
          <p>Already have an Account?<span><Link to='/login' replace>Log-In</Link></span></p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" id="email" name="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <button type="submit">Sign-In</button>
          </form>
        </div>
      </>
      
    )
  );
}

export default SignIn;