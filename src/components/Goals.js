import React, { useState, useEffect } from 'react';
import { addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db, goalsCollection } from '../index'; // Import db and goalsCollection from index.js


function Goals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const q = query(goalsCollection, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const goalsData = [];
      querySnapshot.forEach((doc) => {
        goalsData.push({ id: doc.id, ...doc.data() });
      });
      setGoals(goalsData);
    } catch (error) {
      console.error('Error fetching goals: ', error);
    }
  };

  const handleAddGoal = async () => {
    if (newGoal.trim() !== '') {
      const goalData = {
        text: newGoal,
        timestamp: new Date(),
      };
      await addDoc(goalsCollection, goalData);
      setNewGoal('');
      fetchGoals();
    }
  };

  return (
    <div class="container mx-auto">
      <h2 className="text-xl font-bold mb-4">Goals</h2>
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>{goal.text}</li>
        ))}
      </ul>

      <input
        type="text"
        class="py-3 px-5 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" 
        placeholder="Enter your goal"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
      />
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" onClick={handleAddGoal}>Add Goal</button>
    </div>
    
  );
}

export default Goals;