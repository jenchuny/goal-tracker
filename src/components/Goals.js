import React, { useState, useEffect } from 'react';
import { addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db, goalsCollection } from '../firebaseUtils'; // Import db and goalsCollection from index.js
import { useAuth } from './AuthContext';

function Goals() {
  const [goals, setGoals] = useState([]);
  const { authUser } = useAuth(); 
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    if (authUser) {
      fetchGoals(authUser.uid)
        .then((userGoals) => {
          setGoals(userGoals);
        })
        .catch((error) => {
          console.error('Error fetching goals:', error);
        });
    }
  }, [authUser]);

  const fetchGoals = async () => {
    try {
      if (!authUser) return; // Return early if no user is logged in
  
      const q = query(goalsCollection, where('userId', '==', authUser.uid), orderBy('timestamp'));
      const querySnapshot = await getDocs(q);
      const goalsData = [];
  
      querySnapshot.forEach((doc) => {
        goalsData.push({ id: doc.id, ...doc.data() });
      });

      console.log('Fetched goals:', goalsData);
      setGoals(goalsData);
    } catch (error) {
      console.error('Error fetching goals: ', error);
    }
  };

  const handleAddGoal = async () => {
    if (newGoal.trim() !== '') {
      if (authUser) {
      const goalData = {
        text: newGoal,
        timestamp: new Date(),
        userId: authUser.uid,
        status: 'incomplete'
      };
      await addDoc(goalsCollection, goalData);
      setNewGoal('');
      fetchGoals();
    }
  }
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
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {goals.map((goal) => (
                    <tr key={goal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{goal.timestamp.toDate().toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a className="text-blue-500 hover:text-blue-700" href="#">Delete</a>
                      </td>
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
      <input
        type="text"
        id="hs-trailing-button-add-on" 
        name="hs-trailing-button-add-on" 
        class="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-l-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" 
        placeholder="Enter your goal"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
      />
      <button class="py-3 px-4 inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-r-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" onClick={handleAddGoal}>Add Goal</button>
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
