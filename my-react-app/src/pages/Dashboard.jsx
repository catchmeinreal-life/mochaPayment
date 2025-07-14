import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { authService } from "../services/mochaPayment";
import '../styles/dashboard.css';
import '../styles/global.css';

function Dashboard({ onLogout , isAuthenticated }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);
  
  // Default values if user data is not available
  const userBalance = user?.balance || 0;
  const userName = user?.username || 'User';
  const accountId = user?.accountNumber || 'N/A';
  const coinValueInKES = userBalance * 150; // 1 MochaCoin = 150 KES
  
  const totalTransactions = 127;
  const pendingTransactions = 3;
  const savingsBalance = userBalance * 0.1; // 10% of balance as "savings"
  
  const recentTransactions = [
    { id: 1, type: "Money Sent", recipient: "John Doe", amount: -150.00, date: "2025-01-15", status: "completed" },
    { id: 2, type: "Money Received", sender: "Sarah Wilson", amount: 300.00, date: "2025-01-14", status: "completed" },
    { id: 3, type: "Bill Payment", recipient: "Electric Company", amount: -85.50, date: "2025-01-13", status: "completed" },
    { id: 4, type: "Money Sent", recipient: "Mike Johnson", amount: -75.00, date: "2025-01-12", status: "pending" },
    { id: 5, type: "Deposit", sender: "Bank Transfer", amount: 1000.00, date: "2025-01-11", status: "completed" },
  ];

  if (loading) {
    return (
      <>
        <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
        <div className="dashboard-container">
          <div className="card">
            <div className="card-body text-center">
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {userName}! 🎉</h1>
          <p>Account ID: {accountId}</p>
          <p>Here's what's happening with your MochaPay account today</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon balance">🪙</div>
            <div className="stat-value">{userBalance} MC</div>
            <div className="stat-label">MochaCoins</div>
            <div className="stat-sublabel">≈ {coinValueInKES.toLocaleString()} KES</div>
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
            <div className="stat-value">{savingsBalance.toFixed(1)} MC</div>
            <div className="stat-label">Savings Goal</div>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/payment" className="action-btn">
            <i>💸</i>
            Send MochaCoins
          </Link>
          <a href="#" className="action-btn">
            <i>💳</i>
            Request Money
          </a>
          <a href="#" className="action-btn">
            <i>📱</i>
            Buy MochaCoins
          </a>
          <a href="#" className="action-btn">
            <i>📈</i>
            View Reports
          </a>
        </div>

        <div className="user-info-card">
          <div className="card">
            <div className="card-header">
              <h3>Account Information</h3>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{userName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account ID:</span>
                <span className="info-value">{accountId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Status:</span>
                <span className="info-value status-active">Active</span>
              </div>
            </div>
          </div>
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
                  {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toFixed(2)} MC
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
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





