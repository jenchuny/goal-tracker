import React, { useState, useEffect } from 'react';
import { getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { goalsCollection } from '../firebaseUtils';
import { useAuth } from './AuthContext';
import { startOfWeek, endOfWeek } from 'date-fns';

function WeeklyGoals() {
  const [weekGoals, setWeekGoals] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      fetchThisWeeksGoals(authUser.uid)
        .then((userWeekGoals) => {
          setWeekGoals(userWeekGoals);
        })
        .catch((error) => {
          console.error('Error fetching this week\'s goals:', error);
        });
    }
  }, [authUser]);

  const fetchThisWeeksGoals = async (userId) => {
    try {
      if (!userId) return [];

      const currentWeekStart = startOfWeek(new Date());
      const currentWeekEnd = endOfWeek(new Date());

      const q = query(
        goalsCollection,
        where('userId', '==', userId),
        where('timestamp', '>=', currentWeekStart),
        where('timestamp', '<=', currentWeekEnd)
      );

      const querySnapshot = await getDocs(q);
      const weekGoalsData = [];

      querySnapshot.forEach((doc) => {
        weekGoalsData.push({ id: doc.id, ...doc.data() });
      });

      return weekGoalsData;
    } catch (error) {
      console.error('Error fetching this week\'s goals: ', error);
      return [];
    }
  };

  const handleChangeGoalStatus = async (goalId, currentStatus) => {
    try {
      const goalRef = doc(goalsCollection, goalId);
      const newStatus = currentStatus === 'complete' ? 'incomplete' : 'complete';

      // Update the status to the newStatus
      await updateDoc(goalRef, { status: newStatus });

      // Update the local state to reflect the change and toggle the text
      setWeekGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, status: newStatus } : goal
        )
      );
    } catch (error) {
      console.error('Error toggling goal status:', error);
    }
  };


  // Render the goals in a table similar to your previous component
  return (
    <div className="container mx-auto py-4">
      <div className="p-1.5 min-w-full inline-block align-middle">
        <div className="border rounded-lg overflow-hidden dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Created</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {weekGoals.map((goal) => (
                <tr key={goal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{goal.timestamp.toDate().toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.text}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      className={`text-blue-500 hover:text-blue-700 cursor-pointer`}
                      onClick={() => handleChangeGoalStatus(goal.id, goal.status)}
                    >
                      {goal.status === 'complete' ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WeeklyGoals;