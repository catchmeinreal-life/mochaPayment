import { Navigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import '../styles/dashboard.css';
import '../styles/global.css';

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
  // Dummy data for demonstration
  const userBalance = 2450.75;
  const totalTransactions = 127;
  const pendingTransactions = 3;
  const savingsBalance = 5200.00;
  
  const recentTransactions = [
    { id: 1, type: "Money Sent", recipient: "John Doe", amount: -150.00, date: "2025-01-15", status: "completed" },
    { id: 2, type: "Money Received", sender: "Sarah Wilson", amount: 300.00, date: "2025-01-14", status: "completed" },
    { id: 3, type: "Bill Payment", recipient: "Electric Company", amount: -85.50, date: "2025-01-13", status: "completed" },
    { id: 4, type: "Money Sent", recipient: "Mike Johnson", amount: -75.00, date: "2025-01-12", status: "pending" },
    { id: 5, type: "Deposit", sender: "Bank Transfer", amount: 1000.00, date: "2025-01-11", status: "completed" },
  ];

  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="dashboard-container">
        {isAuthenticated ? (
          <>
            <div className="dashboard-header">
              <h1>Welcome back, User!</h1>
              <p>Here's what's happening with your account today</p>
            </div>

            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon balance">💰</div>
                <div className="stat-value">${userBalance.toFixed(2)}</div>
                <div className="stat-label">Current Balance</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon transactions">📊</div>
                <div className="stat-value">{totalTransactions}</div>
                <div className="stat-label">Total Transactions</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon pending">⏳</div>
                <div className="stat-value">{pendingTransactions}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon savings">🏦</div>
                <div className="stat-value">${savingsBalance.toFixed(2)}</div>
                <div className="stat-label">Savings</div>
              </div>
            </div>

            <div className="dashboard-actions">
              <Link to="/payment" className="action-btn">
                <i>💸</i>
                Send Money
              </Link>
              <a href="#" className="action-btn">
                <i>💳</i>
                Request Money
              </a>
              <a href="#" className="action-btn">
                <i>📱</i>
                Pay Bills
              </a>
              <a href="#" className="action-btn">
                <i>📈</i>
                View Reports
              </a>
            </div>

            <div className="recent-transactions">
              <div className="transaction-header">
                Recent Transactions
              </div>
              <div className="transaction-list">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-type">{transaction.type}</div>
                      <div className="transaction-date">
                        {transaction.recipient && `To: ${transaction.recipient}`}
                        {transaction.sender && `From: ${transaction.sender}`}
                        {' • ' + new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="card">
            <div className="card-body text-center">
              <h2>Access Denied</h2>
              <p>You are not authenticated. Please log in to access your dashboard.</p>
              <Link to="/login" className="btn btn-primary">Login</Link>
            </div>
          </div>
        )}
      </div>
    </>
    
  );
}

export default Dashboard;





