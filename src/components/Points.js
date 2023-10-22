import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getDocs, query, where } from 'firebase/firestore';
import { goalsCollection, rewardsCollection } from '../firebaseUtils';

function Points() {
  const { authUser } = useAuth(); 
  const [points, setPoints] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);

  useEffect(() => {
    if (authUser) {
      fetchPoints(authUser.uid);
      fetchUsedPoints(authUser.uid);
    }
  }, [authUser]);

  const fetchPoints = async (userId) => {
    try {
      if (!authUser) return; // Return early if no user is not logged in
  
      const q = query(goalsCollection, where("userId", "==", userId), where("status", "==", "complete"));
      const querySnapshot = await getDocs(q);
  
      let totalPoints = 0;
      querySnapshot.forEach((doc) => {
        totalPoints += Number(doc.data().assignedPoints);
      });
  
      setPoints(totalPoints);
    } catch (error) {
      console.error('Error fetching points: ', error);
    }
  };

  const fetchUsedPoints = async (userId) => {
    try {
      if (!authUser) return; // Return early if no user is not logged in
  
      const q = query(rewardsCollection, where("userId", "==", userId), where("redeemed", "==", true));
      const querySnapshot = await getDocs(q);
  
      let totalUsedPoints = 0;
      querySnapshot.forEach((doc) => {
        totalUsedPoints += Number(doc.data().assignedPoints);
      });
  
      setUsedPoints(totalUsedPoints);
    } catch (error) {
      console.error('Error fetching used points: ', error);
    }
  };
    
  const pointsLeft = points - usedPoints;

  return (
    <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:pl-72">
      <h3>Your Points</h3>
      <p>Total Points Earned: {points}</p>
      <p>Points Used: {usedPoints}</p>
      <p>Points Left: {pointsLeft}</p>
    </div>
  );
}

export default Points;