import { useState } from 'react'

import './App.css'


const paymentForm = () => {
  const [ sender, setSender] = useState('');
  const [ receiver, setReceiver] = useState('');
  const [ amount, setAmount] = useState('');

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({sender, receiver, amount: Number(amount)})
      })

      const data = await response.json();
      alert(data.message || data.error);
    } catch (error) {
      console.error("payment error: ", error)
    }
  }

  return (
    <div>
      <h1>Bank Transfer Payment</h1>
      <input type="text" name="" id="" placeholder='Sender Account' onChange={e => setSender(e.target.value)} />
      <input type="text" name="" id="" placeholder='Receiver Account' onChange={e => setReceiver(e.target.value)} />
      <input type="number" name="" id="" placeholder='Amount' onChange={e => setAmount(e.target.value)}/>



      <p>{sender}, {receiver}, {amount}</p>
      <button onClick={handlePayment}>Send Payment</button>
    </div>
  );
};

export default paymentForm;
