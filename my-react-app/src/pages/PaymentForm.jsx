import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import '../styles/payment.css';
import '../styles/global.css';


function PaymentForm({ onLogout, isAuthenticated }) {
  const [ sender, setSender] = useState('');
  const [ receiver, setReceiver] = useState('');
  const [ amount, setAmount] = useState('');
  const [ paymentMethod, setPaymentMethod] = useState('wallet');
  const [ note, setNote] = useState('');
  const [ selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  
  // Dummy data
  const userAccounts = [
    { id: '123456789', name: 'Main Account', balance: 2450.75 },
    { id: '987654321', name: 'Savings Account', balance: 5200.00 },
  ];
  
  const quickAmounts = [50, 100, 200, 500, 1000];
  
  const recentContacts = [
    { id: '111222333', name: 'John Doe', avatar: '👨' },
    { id: '444555666', name: 'Sarah Wilson', avatar: '👩' },
    { id: '777888999', name: 'Mike Johnson', avatar: '👨‍💼' },
  ];

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
    setSelectedQuickAmount(quickAmount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submission

    alert("form submitted");
    // validate input
    if (!sender || !receiver || !amount) {
      alert("Please fill in all fields");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    // make the payment request
    try {
      const response = await fetch('http://localhost:3000/pay', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({sender, receiver, amount: Number(amount)})
      })

      const data = await response.json();
      console.log(data);

      alert(data.message || data.error);
    } catch (error) {
      console.error("payment error: ", error)
    }
  }

  return (
    <>
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
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
                  <div className="form-row">
                    <div className="form-col">
                      <div className="form-group">
                        <label className="form-label">From Account</label>
                        <select 
                          className="account-dropdown form-control"
                          value={sender} 
                          onChange={(e) => setSender(e.target.value)}
                          required
                        >
                          <option value="">Select account</option>
                          {userAccounts.map(account => (
                            <option key={account.id} value={account.id}>
                              {account.name} - ${account.balance.toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-col">
                      <div className="form-group">
                        <label className="form-label">To Account</label>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="Enter account number or email"
                          value={receiver} 
                          onChange={(e) => setReceiver(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Recent Contacts</label>
                    <div className="quick-amounts">
                      {recentContacts.map(contact => (
                        <button
                          key={contact.id}
                          type="button"
                          className={`quick-amount-btn ${receiver === contact.id ? 'active' : ''}`}
                          onClick={() => setReceiver(contact.id)}
                        >
                          {contact.avatar} {contact.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Amount</label>
                    <div className="amount-input-container">
                      <span className="currency-symbol">$</span>
                      <input 
                        type="number" 
                        className="form-control amount-input"
                        placeholder="0.00"
                        value={amount} 
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setSelectedQuickAmount(null);
                        }}
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                    <div className="quick-amounts">
                      {quickAmounts.map(quickAmount => (
                        <button
                          key={quickAmount}
                          type="button"
                          className={`quick-amount-btn ${selectedQuickAmount === quickAmount ? 'active' : ''}`}
                          onClick={() => handleQuickAmount(quickAmount)}
                        >
                          ${quickAmount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Note (Optional)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="What's this for?"
                      value={note} 
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <div className="payment-methods">
                    <label className="form-label">Payment Method</label>
                    <div className="payment-method selected">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="wallet" 
                        checked={paymentMethod === 'wallet'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-method-info">
                        <div className="payment-method-name">💰 Wallet Balance</div>
                        <div className="payment-method-desc">Instant transfer from your wallet</div>
                      </div>
                    </div>
                    <div className="payment-method">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="bank" 
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-method-info">
                        <div className="payment-method-name">🏦 Bank Account</div>
                        <div className="payment-method-desc">Transfer from linked bank account</div>
                      </div>
                    </div>
                  </div>

                  {amount && (
                    <div className="payment-summary">
                      <div className="summary-row">
                        <span>Amount:</span>
                        <span>${parseFloat(amount || 0).toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Fee:</span>
                        <span>$0.00</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total:</span>
                        <span>${parseFloat(amount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="submit-section">
                  <button type="submit" className="submit-btn">
                    Send ${parseFloat(amount || 0).toFixed(2)}
                  </button>
                </div>
              </form>
            </div>

            <div className="transaction-history">
              <div className="history-header">
                <h3>Transaction History</h3>
                <div className="filter-buttons">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Sent</button>
                  <button className="filter-btn">Received</button>
                  <button className="filter-btn">Pending</button>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-type">Money Sent to John Doe</div>
                      <div className="transaction-date">January 15, 2025 • 2:30 PM</div>
                    </div>
                    <div className="transaction-amount negative">-$150.00</div>
                  </div>
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-type">Money Received from Sarah Wilson</div>
                      <div className="transaction-date">January 14, 2025 • 11:45 AM</div>
                    </div>
                    <div className="transaction-amount positive">+$300.00</div>
                  </div>
                  <div className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-type">Money Sent to Mike Johnson</div>
                      <div className="transaction-date">January 12, 2025 • 4:15 PM</div>
                    </div>
                    <div className="transaction-amount negative">-$75.00</div>
                  </div>
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
};



export default PaymentForm;