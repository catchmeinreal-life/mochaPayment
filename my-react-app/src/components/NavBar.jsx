import React from "react";
import { Link } from "react-router-dom";

function NavBar() {


    return (
        <>
        <nav>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/login'>LogIn</Link></li>
                <li><Link to='/signin'>SignIn</Link></li>
            </ul>
        </nav>
        </>
    )
}


export default NavBar;