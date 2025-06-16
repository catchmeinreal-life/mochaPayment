// import { useState } from 'react'
// import React from 'react';
// import Greeting from './components/Greeting';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

// import './App.css'

import PaymentForm from './pages/PaymentForm';
// import Greeting from './components/Greeting';
// import Hello from './components/Hello';

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const isAuthenticated = false; // get this from your auth logic/context

  // return PaymentForm();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/" element={<Home />}></Route>
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
