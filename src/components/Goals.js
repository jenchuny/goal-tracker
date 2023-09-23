import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db, goalsCollection } from '../firebaseUtils'; // Import db and goalsCollection from index.js

function Goals() {
  const { authUser } = useAuth(); 
  const [goals, setGoals] = useState([]);
  const [newGoals, setNewGoals] = useState(['', '', '']);

  // useEffect(() => {
  //   if (authUser) {
  //     fetchGoals(authUser.uid)
  //       .then((userGoals) => {
  //         setGoals(userGoals);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching goals:', error);
  //       });
  //   }
  // }, [authUser]);

  useEffect(() => {
    if (authUser) {
      fetchGoals(authUser.uid);
    }
  }, []); // Empty dependency array for initial load
  

  const fetchGoals = async (userId) => {
    try {
      if (!authUser) return; // Return early if no user is logged in
  
      const q = query(goalsCollection, where('userId', '==', userId), orderBy('timestamp'));
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


  const handleAddGoal = async () => {
    const trimmedGoals = newGoals.map((goal) => goal.trim());
    const validGoals = trimmedGoals.filter((goal) => goal !== '');

    if (validGoals.length > 0 && authUser) {
      const goalPromises = validGoals.map((goalText) => {
        const goalData = {
          text: goalText,
          timestamp: new Date(),
          userId: authUser.uid,
          status: 'incomplete',
        };
        return addDoc(goalsCollection, goalData);
      });

      await Promise.all(goalPromises);
      setNewGoals(['', '', '']); // Clear input fields
      fetchGoals(authUser.uid);
    }
  };

  const handleGoalInputChange = (index, value) => {
    const updatedGoals = [...newGoals];
    updatedGoals[index] = value;
    setNewGoals(updatedGoals);
  };

  const GoalsTable = ({ goals }) => {
    
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created by</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {goals.map((goal) => (
                    <tr key={goal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{goal.timestamp.toDate().toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.text}</td>
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
  };

  return (
<div className="container mx-auto py-4">

<div class="flex rounded-md shadow-sm">
        {newGoals.map((goal, index) => (
          <input
            key={index}
            type="text"
            id={`goal-input-${index}`}
            name={`goal-input-${index}`}
            class="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-l-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
            placeholder={`Enter your goal ${index + 1}`}
            value={goal}
            onChange={(e) => handleGoalInputChange(index, e.target.value)}
          />
        ))}
        <button class="py-3 px-4 inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-r-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" onClick={handleAddGoal}>Add Goals</button>
      </div>

    {goals && goals.length > 0 ? (
  <GoalsTable goals={goals} />
) : (
  <p>No goals available.</p>
)}

  
    </div>

  );
}

export default Goals;
