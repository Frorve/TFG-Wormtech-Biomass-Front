import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './adapters/pages/LoginForm';
import Register from './adapters/pages/Register';
import Home from "./adapters/pages/Home"
import 'tailwindcss/tailwind.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/react-project" element={<LoginForm/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/home/:username" element={<Home/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
