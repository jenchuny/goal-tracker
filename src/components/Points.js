import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getDoc, doc } from 'firebase/firestore';
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
  
      const userRef = doc(userCollection, userId); // Use userId as the document ID
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
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
    <div class ="w-full pt-10 px-4 sm:px-6 md:px-8 lg:pl-72">
      <h1>Your Points</h1>
      <p>Points Earned: {points.pointsEarned}</p>
      <p>Redeemed Points: {points.pointsRedeemed}</p>
    </div>
  );
}

export default Points;
