import React from 'react';
import './App.css';
import Goals from './components/Goals';
import SignUpPage from './pages/SignupPage';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AuthDetails from './components/AuthDetails';

function App() {
  useEffect(() => {
    import('preline');
  }, []);

  return (
<div>
    <Router>
    <nav>
      <ul>
      <li>
          <Link to="/goals">Goals</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
        <AuthDetails />
        </li>
      </ul>
    </nav>

      <Routes>
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/goals" element={<Goals/>} />
        <Route path="/login" element={<LoginPage/>} />
        
      </Routes>
    </Router>
</div>
    
  );

}


export default App;
