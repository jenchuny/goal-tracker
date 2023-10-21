import React, { useState, useEffect } from 'react';
import { getDocs, query, where, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import { goalsCollection, userCollection } from '../firebaseUtils';
import { useAuth } from './AuthContext';
import { startOfWeek, endOfWeek } from 'date-fns';
import { TodoCard } from './Card';

function WeeklyGoals() {
  const [weekGoals, setWeekGoals] = useState([]);
  const { authUser } = useAuth();
  const [newGoals, setNewGoals] = useState(['']);
  const [userPoints, setUserPoints] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (authUser) {
      fetchThisWeeksGoals(authUser.uid)
        .then((userWeekGoals) => {
          setWeekGoals(userWeekGoals);
        })
        .catch((error) => {
          console.error('Error fetching this week\'s goals:', error);
        });
      fetchUserPoints(authUser.uid)
        .then((points) => {
          setUserPoints(points);
        })
        .catch((error) => {
          console.error('Error fetching user points:', error);
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

  const fetchUserPoints = async (userId) => {
    try {
      const userRef = doc(userCollection, userId);
  
      // Fetch the user document
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.pointsEarned;
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const handleAddGoal = async () => {
    const goalText = newGoals[0].trim();

    if (goalText !== '' && authUser) {
      const goalData = {
        text: goalText,
        timestamp: new Date(),
        userId: authUser.uid,
        status: 'incomplete',
        assignedPoints: selectedPoints // Use selectedPoints here
      };
      await addDoc(goalsCollection, goalData);
      setNewGoals(['']); // Clear input field
      setShowModal(false); // Close the modal
      fetchThisWeeksGoals(authUser.uid); // Fetch the updated goals
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
        setUserPoints(userPoints + pointsChange);
      }
    } catch (error) {
      console.error('Error toggling goal status:', error);
    }
  };
  

  // const handlePointsChange = async (goalId, newPoints) => {
  //   try {
  //     const goalRef = doc(goalsCollection, goalId);
  
  //     // Update the points for the goal in Firestore
  //     await updateDoc(goalRef, { assignedPoints: newPoints });
  
  //     // Update the local state to reflect the change
  //     setWeekGoals((prevGoals) =>
  //       prevGoals.map((goal) =>
  //         goal.id === goalId ? { ...goal, assignedPoints: newPoints } : goal
  //       )
  //     );
  //   } catch (error) {
  //     console.error('Error updating points for goal:', error);
  //   }
  // };


  // Render the goals in a table similar to your previous component
  const WeeklyGoalsTable = ({ goals }) => {
    return (
    <div className="container mx-auto py-4">
      <div className="p-1.5 min-w-full inline-block align-middle">
        <div className="border rounded-lg overflow-hidden dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date created</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                {/* <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Assign Points</th> */}
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
                  {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                  </td> */}
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
  <div class ="w-full pt-10 px-4 sm:px-6 md:px-10 lg:pl-72 pb-10">
  <div className="flex justify-between items-center w-full mx-auto">
    <h1 className="text-3xl font-semibold">Goals</h1>
    <button
        type="button"
        className="py-2 px-4 inline-flex flex-shrink-0 justify-end items-center gap-2 rounded-md border border-black font-semibold bg-transparent text-black hover:bg-gray-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all text-lg"
        onClick={() => setShowModal(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Goals
      </button>
  </div>
      {showModal ? (
        <div className="fixed z-10 inset-0 overflow-y-auto mb-5" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-white bg-opacity-75 transition-opacity mb-5" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen mb-5" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left mb-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5" id="modal-title">
                      Add Goals
                    </h3>
                    <div className="mt-2">
                      {newGoals.map((goal, index) => (
                        <div className="flex flex-col">
                          <input
                            key={index}
                            type="text"
                            id={`goal-input-${index}`}
                            name={`goal-input-${index}`}
                            className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 mb-5"
                            placeholder={`Enter your goal ${index + 1}`}
                            value={goal}
                            onChange={(e) => handleGoalInputChange(index, e.target.value)}
                            style={{paddingLeft: '1rem', paddingRight: '1rem'}}
                          />
                          <label htmlFor="points-select" className="block text-sm mb-2 dark:text-white">Assign points</label>
                          <select
                            id="points-select"
                            name="points-select"
                            className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            value={selectedPoints}
                            onChange={(e) => setSelectedPoints(parseInt(e.target.value))}
                            style={{paddingLeft: '1rem', paddingRight: '1rem'}}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-semibold text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddGoal}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                   onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
  
    {weekGoals && weekGoals.length > 0 ? (
      <WeeklyGoalsTable goals={weekGoals} />
        ) : (
          <p>No goals available.</p>
      )}
  
      
      

    </div>
    );
    
  }

export default WeeklyGoals;
