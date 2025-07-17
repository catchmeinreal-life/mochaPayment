import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import '../styles/payment.css';
import '../styles/global.css';
import { walletService } from '../services/mochaPayment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PaymentForm({ onLogout, isAuthenticated }) {
  const [toAccountId, settoAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setdescription] = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const quickAmounts = [1, 3, 5, 7, 9];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletData = await walletService.getWalletBalance();
        setWallet(walletData);

        const txData = await walletService.getTransactions();
        setTransactions(txData);
      } catch (err) {
        toast.error('Failed to load wallet data');
        console.error('PaymentForm init error:', err.message);
      }
    };
    fetchData();
  }, []);

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
    setSelectedQuickAmount(quickAmount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!toAccountId || !amount) {
      toast.warn("Please fill in all fields");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      toast.warn("Please enter a valid amount");
      return;
    }

    try {
      const body = JSON.stringify({
        toAccountId,
        amount: Number(amount),
        description,
      });

      const response = await walletService.makeTransaction(body);

      if (response?.success) {
        toast.success('✅ Transaction successful!');
        settoAccountId('');
        setAmount('');
        setdescription('');
        setSelectedQuickAmount(null);

        // refresh wallet and transaction data
        const updatedWallet = await walletService.getWalletBalance();
        setWallet(updatedWallet);

        const txData = await walletService.getTransactions();
        setTransactions(txData);
      } else {
        toast.error(response?.message || 'Transaction failed.');
      }

    } catch (error) {
      console.error("Payment error: ", error);
      toast.error("Something went wrong during the transaction.");
    }
  };

  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="payment-container">
        {isAuthenticated ? (
          <>
            <div className="payment-header">
              <h1>Send Money</h1>
              <p>Transfer funds quickly and securely</p>
            </div>

            <div className="payment-form-container">
              <div className="payment-form-header">
                <h2>💸 New Transfer</h2>
                <p>Send money to friends, family, or businesses</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="payment-form-body">

                  {/* From Wallet */}
                  <div className="form-group">
                    <label className="form-label">From Wallet</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${wallet?.accountId ?? '---'} | Balance: ${wallet?.balance ?? '---'} MC`}
                      disabled
                    />
                  </div>

                  {/* To Account */}
                  <div className="form-group">
                    <label className="form-label">To Account</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter recipient account ID"
                      value={toAccountId}
                      onChange={(e) => settoAccountId(e.target.value)}
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div className="form-group">
                    <label className="form-label">Amount</label>
                    <div className="amount-input-container">
                      <span className="currency-symbol"></span>
                      <input
                        type="number"
                        className="form-control amount-input"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setSelectedQuickAmount(null);
                        }}
                        min="0"
                        required
                      />
                    </div>
                    <div className="quick-amounts">
                      {quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          type="button"
                          className={`quick-amount-btn ${selectedQuickAmount === quickAmount ? 'active' : ''}`}
                          onClick={() => handleQuickAmount(quickAmount)}
                        >
                          {quickAmount} MC
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">Description (optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What's this for?"
                      value={description}
                      onChange={(e) => setdescription(e.target.value)}
                    />
                  </div>

                  {/* Payment Summary */}
                  {amount && (
                    <div className="payment-summary">
                      <div className="summary-row">
                        <span>Amount:</span>
                        <span>{parseFloat(amount || 0).toFixed(2)} MC</span>
                      </div>
                      <div className="summary-row">
                        <span>Fee:</span>
                        <span>0.00 MC</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total:</span>
                        <span>{parseFloat(amount || 0).toFixed(2)} MC</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="submit-section">
                    <button type="submit" className="submit-btn">
                      Send {parseFloat(amount || 0).toFixed(2)} MC
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Transaction History */}
            <div className="transaction-history">
              <div className="history-header">
                <h3>Transaction History</h3>
              </div>
              <div className="card">
                <div className="card-body">
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
        ) : (
          <div className="card">
            <div className="card-body text-center">
              <h2>Authentication Required</h2>
              <p>Please log in to access the payment system.</p>
              <a href="/login" className="btn btn-primary">Login</a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PaymentForm;
