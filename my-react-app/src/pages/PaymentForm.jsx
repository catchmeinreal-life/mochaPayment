import React, { useState } from 'react';
// import './PaymentForm.css'; // Optional: Add your CSS styles here


function PaymentForm ({onLogout, isAuthenticated}) {
  const [ sender, setSender] = useState('');
  const [ receiver, setReceiver] = useState('');
  const [ amount, setAmount] = useState('');

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
    isAuthenticated ? (
      <div>
        <form action="" onSubmit={handleSubmit}>
          <h1>Bank Transfer Payment</h1>

          <label htmlFor="">
            Sender Account:
            <input type='text' value={sender} onChange={(e) => setSender(e.target.value)} 
              required
            />
          </label>
          
          <label htmlFor="">
            Receiver Account:
            <input type='text' value={receiver} onChange={(e) => setReceiver(e.target.value)} 
              required
            />
          </label>
          <br />
          <label htmlFor="">
            Amount:
            <input type='number' value={amount} onChange={(e) => setAmount(e.target.value)} 
              required
            />
          </label>

          <button type='submit'>Send Payment</button>
        </form>
      </div>
    ) : <p>Please log in to transact</p>
  );
};



export default PaymentForm;