// src/firebaseUtils.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
const userCollection = collection(db, 'user');
const rewardsCollection = collection(db, 'rewards');

console.log('Firebase module is loaded.');


export { auth, db, goalsCollection, userCollection, rewardsCollection };
