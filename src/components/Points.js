import React, { useState, useEffect } from 'react';
import { getDocs, query, where } from 'firebase/firestore';
import { goalsCollection, rewardsCollection } from '../firebaseUtils';

function Points({ userId }) {
  const [points, setPoints] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchPoints(userId);
      fetchUsedPoints(userId);
    }
  }, [userId]);

  const fetchPoints = async (userId) => {
    try {
      if (!userId) return; // Return early if no user is not logged in
  
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
      if (!userId) return; // Return early if no user is not logged in
  
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
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-800">
          <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
              <p class="text-xs uppercase tracking-wide text-gray-500">
                Total Points Earned
              </p>
            </div>
            <div class="mt-1 flex items-center">
              <h3 class="text-xl sm:text-2xl font-medium text-orange-500 dark:text-gray-200">
                {points}
              </h3>
            </div>
          </div>
        </div>
        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-800">
          <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
              <p class="text-xs uppercase tracking-wide text-gray-500">
                Points Used
              </p>
            </div>
            <div class="mt-1 flex items-center">
              <h3 class="text-xl sm:text-2xl font-medium text-orange-500 dark:text-gray-200">
                {usedPoints}
              </h3>
            </div>
          </div>
        </div>
        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-800">
          <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
              <p class="text-xs uppercase tracking-wide text-gray-500">
                Points Left
              </p>
            </div>
            <div class="mt-1 flex items-center">
              <h3 class="text-xl sm:text-2xl font-medium text-orange-500 dark:text-gray-200">
                {pointsLeft}
              </h3>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Points;