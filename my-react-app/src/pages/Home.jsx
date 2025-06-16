import { BrowserRouter, Link } from "react-router-dom";
/**localhost:5175/ */

function Home({ onLogout, isAuthenticated }) {
    return (
        <div>
        <nav>
            <Link to="/">Home</Link> | 
            <Link to="/about">About</Link> |
            <Link to="/payment">Payment</Link>
            {isAuthenticated && (
                <>
                {' | '}
                <button onClick={onLogout} style={{marginLeft: 8}}>Logout</button>
                </>
            )}
        </nav>
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of your React application.</p>
        <p>You can navigate to other pages using the links in the navigation bar.</p>
        </div>
    );
}

export default Home;