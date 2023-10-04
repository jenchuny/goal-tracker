import React, { useState, useEffect } from 'react';
import { getDocs, query, where, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import { goalsCollection, userCollection } from '../firebaseUtils';
import { useAuth } from './AuthContext';
import { startOfWeek, endOfWeek } from 'date-fns';
import { TodoCard } from './Card';

function WeeklyGoals() {
  const [weekGoals, setWeekGoals] = useState([]);
  const { authUser } = useAuth();
  const [newGoals, setNewGoals] = useState(['', '', '']);

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
          assignedPoints: 0
        };
        return addDoc(goalsCollection, goalData);
      });

      await Promise.all(goalPromises);
      setNewGoals(['', '', '']); // Clear input fields
      fetchThisWeeksGoals(authUser.uid);
    }
  };

  const handleGoalInputChange = (index, value) => {
    const updatedGoals = [...newGoals];
    updatedGoals[index] = value;
    setNewGoals(updatedGoals);
  };

  const handleChangeGoalStatus = async (goalId, currentStatus) => {
    try {
      const goalRef = doc(goalsCollection, goalId);
      const newStatus = currentStatus === 'complete' ? 'incomplete' : 'complete';
  
      // Fetch the goal document to get assigned points
      const goalDoc = await getDoc(goalRef);
  
      if (!goalDoc.exists()) {
        console.error('Goal document does not exist.');
        return;
      }
  
      const goalData = goalDoc.data();
      const assignedPoints = Number(goalData.assignedPoints); // Convert to a number   
  
      // Calculate the points change based on the status
      let pointsChange = 0;

      if (currentStatus === 'incomplete' && newStatus === 'complete') {
        // Goal changed from incomplete to complete, add points to pointsChange
        pointsChange = assignedPoints;
      } else if (currentStatus === 'complete' && newStatus === 'incomplete') {
        // Goal changed from complete to incomplete, subtract points from pointsChange
        pointsChange = -assignedPoints;
      }
  
      // Update the status to the newStatus
      await updateDoc(goalRef, { status: newStatus });
  
      // Update the local state to reflect the change and toggle the text
      setWeekGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, status: newStatus } : goal
        )
      );
  
      // Update the pointsEarned in the user's document based on the status change
      if (authUser) {
        await updatePointsEarned(authUser.uid, pointsChange);
      }
    } catch (error) {
      console.error('Error toggling goal status:', error);
    }
  };
  

  const handlePointsChange = async (goalId, newPoints) => {
    try {
      const goalRef = doc(goalsCollection, goalId);
  
      // Update the points for the goal in Firestore
      await updateDoc(goalRef, { assignedPoints: newPoints });
  
      // Update the local state to reflect the change
      setWeekGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, assignedPoints: newPoints } : goal
        )
      );
    } catch (error) {
      console.error('Error updating points for goal:', error);
    }
  };

  const updatePointsEarned = async (userId, pointsChange) => {
    try {
      const userRef = doc(userCollection, userId);
  
      // Fetch the user document
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedPointsEarned = userData.pointsEarned + pointsChange;
  
        // Update the pointsEarned in the user's document
        await updateDoc(userRef, { pointsEarned: updatedPointsEarned });
      }
    } catch (error) {
      console.error('Error updating pointsEarned:', error);
    }
  };
  


  const TH = ({children}) => {
    return <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{children}</th>
  }

  // Render the goals in a table similar to your previous component
  const WeeklyGoalsTable = ({ goals }) => {
    return (
    <div className="container mx-auto py-4">
      <div className="p-1.5 min-w-full inline-block align-middle">
        <div className="border rounded-lg overflow-hidden dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <TH>Date Created</TH>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Assign Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {weekGoals.map((goal) => (
                <tr key={goal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{goal.timestamp.toDate().toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.text}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.assignedPoints}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{goal.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      className={`text-blue-500 hover:text-blue-700 cursor-pointer`}
                      onClick={() => handleChangeGoalStatus(goal.id, goal.status)}
                    >
                      {goal.status === 'complete' ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {goal.status !== 'complete' ? (
        <div>
<select
  value={goal.assignedPoints} // Use assignedPoints
  onChange={(e) => handlePointsChange(goal.id, e.target.value)}
>
  <option value="1">1 point</option>
  <option value="2">2 points</option>
  <option value="3">3 points</option>
  <option value="4">4 points</option>
  <option value="5">5 points</option>
</select>

        </div>
      ) : (
        'N/A'
      )}
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

return (
  <div className="container mx-auto py-4">
      {/* <TodoCard
  title={'💜 Complete section 2 in my Udemy course'}
  checked={false}
  points={5}
  />  */}
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
  
  
    {weekGoals && weekGoals.length > 0 ? (
      <WeeklyGoalsTable goals={weekGoals} />
        ) : (
          <p>No goals available.</p>
      )}
  
      
      

    </div>
    );
    
  }

export default WeeklyGoals;