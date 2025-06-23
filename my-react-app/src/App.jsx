// import { useState } from 'react'
// import React from 'react';
// import Greeting from './components/Greeting';

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

// import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
