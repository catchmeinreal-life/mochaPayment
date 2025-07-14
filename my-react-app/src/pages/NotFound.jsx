import { Link } from "react-router-dom"
import '../styles/global.css';

function NotFound() {


    return(
        <div className="container">
            <div className="card text-center">
                <div className="card-body">
                    <h1 style={{fontSize: '4rem', marginBottom: '20px'}}>404</h1>
                    <h2>Page Not Found</h2>
                    <p>Sorry, the page you are looking for does not exist.</p>
                    <Link to='/' replace className="btn btn-primary">Go to Home page</Link>
                </div>
            </div>
        </div>
    )
}

export default NotFound;