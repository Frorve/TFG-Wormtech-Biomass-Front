import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './adapters/pages/LoginForm';
import MainPage from './adapters/pages/MainPage';
import Register from './adapters/pages/Register';
import AboutContact from './adapters/components/AboutComponent/AboutContact';
import Forget from './adapters/pages/Forget'
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
          {/* <Route path="/main/:username" element={<MainPage/>} /> */}
          <Route path="/register" element={<Register/>} />
          {/* <Route path="/about" element={<AboutContact/>} /> */}
          <Route path="/recuperar" element={<Forget/>} />
          <Route path="/home/:username" element={<Home/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
