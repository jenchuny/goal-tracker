import React from 'react';
import './App.css';
import Goals from './components/Goals';
import SignUpPage from './pages/SignupPage';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  useEffect(() => {
    import('preline');
  }, []);

  return (
    <div className="App">
        <h1 class ="text-3xl font-bold underline">GOALS!</h1>

    <Router>
    <nav>
      <ul>
      <li>
          <Link to="/goals">Goals</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </nav>

      <Routes>
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/goals" element={<Goals/>} />
      </Routes>
    </Router>

    <SignUpPage />
    </div>

    
  );

}


export default App;
