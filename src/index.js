import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXp7LHmtn_cNXkfNwUAjxjxtY3AYX2_sM",
  authDomain: "goal-tracker-e5883.firebaseapp.com",
  projectId: "goal-tracker-e5883",
  storageBucket: "goal-tracker-e5883.appspot.com",
  messagingSenderId: "89205323125",
  appId: "1:89205323125:web:441504fd4a8c52f6f34f3c",
  measurementId: "G-VVEB1F040G"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const goalsCollection = collection(db, 'goals');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { db, goalsCollection };