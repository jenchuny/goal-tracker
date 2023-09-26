import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getDocs, query, where } from 'firebase/firestore';
import { userCollection } from '../firebaseUtils'; 

function Points() {
  const { authUser } = useAuth(); 
  const [points, setPoints] = useState({
    pointsEarned: 0,
    pointsRedeemed: 0,
  });

  useEffect(() => {
    if (authUser) {
      fetchPoints(authUser.uid);
    }
  }, [authUser]);

  const fetchPoints = async (userId) => {
    try {
      if (!authUser) return; // Return early if no user is not logged in

      const q = query(userCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        // Assuming there's only one matching document for the user
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        setPoints({
          pointsEarned: userData.pointsEarned || 0,
          pointsRedeemed: userData.pointsRedeemed || 0,
        });
      } else {
        // Handle the case where there's no matching user document
        console.log('User document not found.');
      }
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
}

export default Points;
