import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db, goalsCollection } from '../firebaseUtils'; // Import db and goalsCollection from index.js

function Goals() {
  const { authUser } = useAuth(); 
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (authUser) {
      fetchGoals(authUser.uid);
    }
  }, []); // Empty dependency array for initial load
  

  const fetchGoals = async (userId) => {
    try {
      if (!authUser) return; // Return early if no user is logged in
  
      const q = query(goalsCollection, where('userId', '==', userId), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const goalsData = [];
  
      querySnapshot.forEach((doc) => {
        goalsData.push({ id: doc.id, ...doc.data() });
      });

      setGoals(goalsData); // Update the state with fetched goals
    } catch (error) {
      console.error('Error fetching goals: ', error);
    }
  };
    
    return (
      <div className="flex flex-co py-4">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg overflow-hidden dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Created</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Points</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created by</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {goals.map((goal) => (
                    <tr key={goal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{goal.timestamp.toDate().toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.assignedPoints}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
                  }

export default Goals;
