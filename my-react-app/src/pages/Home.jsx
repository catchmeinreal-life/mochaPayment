import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { walletService } from '../services/mochaPayment';
import '../styles/global.css';


export default function Home({ onLogout, isAuthenticated }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  setUser(storedUser);

  if (isAuthenticated) {
    const loadDashboardData = async () => {
      try {
        const walletData = await walletService.getWalletBalance();
        setWallet(walletData);

        const txData = await walletService.getTransactions();
        setTransactions(txData);
      } catch (err) {
        console.error('Dashboard data load error:', err.message);
      }
    };

    loadDashboardData();
  }
}, [isAuthenticated]);

  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header text-center">
                <h1>Welcome to MochaPay! {user?.username}</h1>
                <p>Your trusted digital payment solution</p>
              </div>
              <div className="card-body">
                {isAuthenticated ? (
                  <div className="text-center">
                    <div className="alert alert-success">
                      <strong>Welcome back!</strong> You are successfully logged in.
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body text-center">
                            <h3>💰</h3>
                            <h5>Account Balance</h5>
                            <p className="text-muted">{wallet?.balance ?? '---'} ɱ</p>
                            {/* <a href="/dashboard" className="btn btn-primary">View Dashboard</a> */}
                            <Link to="/dashboard" className="btn btn-primary">View Dashboard</Link>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body text-center">
                            <h3>💸</h3>
                            <h5>Send Money</h5>
                            <p className="text-muted">Transfer funds instantly</p>
                            {/* <a href="/payment" className="btn btn-success">Send Now</a> */}
                            <Link to="/payment" className="btn btn-success">Send Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="alert alert-info">
                      Please log in to access your dashboard and start making payments.
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body text-center">
                            <h3>🔐</h3>
                            <h5>Secure Payments</h5>
                            <p className="text-muted">Bank-level security for all transactions</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body text-center">
                            <h3>⚡</h3>
                            <h5>Instant Transfers</h5>
                            <p className="text-muted">Send money in seconds, not days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <a href="/login" className="btn btn-primary">Get Started</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}