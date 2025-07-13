import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import '../styles/navbar.css'; // Importing the CSS for styling

function NavBar() {
    const location = useLocation();
    const authPages = location.pathname === '/login' || location.pathname === '/signin';
    const homepage = location.pathname === '/';

    return (
        <>
        {authPages ?
            <header>
                <div className="logo-cont">
                    <a href="#home" className="logo"><img alt="logo" /></a>
                </div>
                <nav>
                    <ul className="navbar">
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/about'>About Us</Link></li>
                        <li><Link to='/contact'>Contact Us</Link></li>
                    </ul>
                </nav>  
               
                <div className="header-icon">
                    {                      
                        location.pathname === '/login' ? 
                            <Link to="/signin" className="signin-link">SignIn</Link> :
                            <Link to="/login" className="login-link">Login</Link>
                    }
                </div>
               
            </header>
        : 
            <header>
                <div className="logo-cont">
                    <a href="#home" className="logo"><img alt="logo" /></a>
                </div>
                <nav>
                    <ul className="navbar">
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/about'>About Us</Link></li>
                        <li><Link to='/contact'>Contact Us</Link></li>
                        { !homepage && <li><Link to='/dashboard'>Dashboard</Link></li> }
                        { !homepage && <li><Link to='/payment'>Payment</Link></li> }
                    </ul>
                </nav>  
               
                <div className="header-icon">
                    <Link to="/login" className="login-link">Login</Link>
                    <Link to="/signin" className="login-link">SignIn</Link>
                </div>
            </header>
        }
            
        </>
    )
}


export default NavBar;