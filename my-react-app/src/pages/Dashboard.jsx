import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import { authService } from '../services/mochaPayment';
import MochaApi from '../services/mochaPayment';
import NavBar from '../components/NavBar';

export default function Dashboard({ isAuthenticated, onLogout }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    const fetchWallet = async () => {
      try {
        const res = await MochaApi.get('/api/wallet/balance');
        setWallet(res.data.data);
      } catch (err) {
        console.error('Failed to fetch wallet:', err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await MochaApi.get('/api/wallet/transactions');
        setTransactions(res.data.data.transactions);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      }
    };

    fetchWallet();
    fetchTransactions();
  }, []);

  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.username}</h1>
          <p>Here is your wallet summary and recent activity.</p>
        </div>

        <div className="user-info-card">
          <div className="info-row">
            <span className="info-label">Account ID:</span>
            <span className="info-value">{wallet?.accountId}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Role:</span>
            <span className="info-value">{user?.role}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Account Status:</span>
            <span className="info-value status-active">Active</span>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon balance">💰</div>
            <div className="stat-value">{wallet?.balance ?? '---'} MochaCoins</div>
            <div className="stat-label">Available Balance</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon transactions">📑</div>
            <div className="stat-value">{transactions.length}</div>
            <div className="stat-label">Total Transactions</div>
          </div>
        </div>

        <div className="dashboard-actions">
          <a href="/payment" className="action-btn">
            <i className="fa fa-paper-plane"></i> Send MochaCoins
          </a>
          <a href="/transactions" className="action-btn">
            <i className="fa fa-list"></i> View Full History
          </a>
        </div>

        <div className="recent-transactions">
          <div className="transaction-header">Recent Transactions</div>
          <div className="transaction-list">
            {transactions.length === 0 ? (
              <div className="transaction-item">No transactions found.</div>
            ) : (
              transactions.slice(0, 5).map(tx => (
                <div key={tx.transactionId} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-type">{tx.description}</div>
                    <div className="transaction-date">{new Date(tx.createdAt).toLocaleString()}</div>
                  </div>
                  <div className={`transaction-amount ${tx.direction === 'incoming' ? 'positive' : 'negative'}`}>
                    {tx.direction === 'incoming' ? '+' : '-'}{tx.amount} MC
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
