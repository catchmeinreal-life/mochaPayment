import React from "react";
import { Link } from "react-router-dom";
import '../styles/navbar.css';
import { useLocation } from "react-router-dom";

function NavBar({ isAuthenticated, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  const isSigninPage = location.pathname === '/signin';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

    return (
        <nav>
            <div className="navbar">
                <Link to="/" className="navbar-brand">MochaPay</Link>
                
                <button className="navbar-toggle" onClick={toggleMenu}>
                    ☰
                </button>
                
                <ul className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li className="nav-item">
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/payment" className="nav-link">Send Money</Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={onLogout} className="nav-link btn btn-danger btn-sm">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : ( isLoginPage ?
                            <li className="nav-item">
                                <Link to="/signin" className="nav-link">Sign-Up</Link>
                            </li> : 
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">Log In</Link>
                            </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}


export default NavBar;