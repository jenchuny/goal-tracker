import React from 'react';
import './App.css';
import Goals from './Goals';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    import('preline');
  }, []);

  return (
    <div className="App">
        <h1 class ="text-3xl font-bold underline">Firebase Goals App</h1>
      <Goals />
    </div>
  );
}

export default App;
