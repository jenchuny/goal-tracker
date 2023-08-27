import React from 'react';
import './App.css';
import Goals from './components/Goals';
import SignUpPage from './pages/SignupPage';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Navigation from './components/Navigation';
import { AuthProvider } from './components/AuthContext'; // Adjust the path to your AuthContext.js

function App() {
  useEffect(() => {
    import('preline');
  }, []);

  return (
<div>
<AuthProvider>
    <Router>
    <Navigation />
    <Routes>
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/goals" element={<Goals/>} />
        <Route path="/login" element={<LoginPage/>} />
        
      </Routes>
  </Router>
  </AuthProvider>
  </div>
);
  }

export default App;
