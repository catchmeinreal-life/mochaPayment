import { Navigate } from "react-router-dom";

/**Dashboard page
 * This page is protected and can only be accessed by authenticated users.
 * If the user is not authenticated, they will be redirected to the login page.
 * 
 * show user information and a logout button.
 * 
 * user information can be fetched from an API or stored in local storage.
 * * The logout button will clear the authentication state and redirect the user to the home page.
 * 
 * show user account and payment information.
 * 
 * 
 * 
 */

function Dashboard({ onLogout , isAuthenticated }) {
  return (
    <div>
      <h1>DashBoard : user</h1>

      { isAuthenticated ? (

        <div>
          <p>Welcome to your dashboard!</p>
          <button onClick={onLogout}>Logout</button>
          <p>Your account information will be displayed here.</p>
          {/* Add more user-specific information here */}
          <p>For example, you can show user account details, payment history, etc.</p>
          <p>Feel free to customize this page as needed.</p>
        </div>

      ) : (
      <div>
        <h2>Access Denied</h2>
        <p>You are not authenticated.</p>
      </div>
      )}
    </div>
    
  );
}

export default Dashboard;
export function Home({ onLogout, isAuthenticated }) {
  return (
    <div>
      <h1>Home Page</h1>
      {isAuthenticated ? (
        <div>
          <p>Welcome back!</p>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <p>Please log in to access your dashboard.</p>
      )}
    </div>
  );
}