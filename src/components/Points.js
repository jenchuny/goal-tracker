import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db, userCollection } from '../firebaseUtils'; 

function Points() {
  const { authUser } = useAuth(); 
  const [points, setPoints] = useState({
    assignedPoints: 0,
    redeemedPoints: 0,
  });

  useEffect(() => {
    if (authUser) {
      fetchPoints(authUser.uid);
    }
  }, []); // Empty dependency array for initial load
  

  const fetchPoints = async (userId) => {
    try {
      if (!authUser) return; // Return early if no user is logged in
  
      const q = query(userCollection, where('userId', '==', userId), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const pointsData = [];
  
      querySnapshot.forEach((doc) => {
        pointsData.push({ id: doc.id, ...doc.data() });
      });

      setPoints(pointsData); // Update the state with fetched goals
    } catch (error) {
      console.error('Error fetching points: ', error);
    }
  };
    
  return (
    <div>
      <h1>Your Points</h1>
      <p>Assigned Points: {points.pointsEarned}</p>
      <p>Redeemed Points: {points.pointsRedeemed}</p>
    </div>
  );
};

export default Points;