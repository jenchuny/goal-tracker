import React, { useState, useEffect } from 'react';
import { getDocs, query, where, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import { goalsCollection, userCollection } from '../firebaseUtils';
import { useAuth } from './AuthContext';
import { startOfWeek, endOfWeek } from 'date-fns';
import { TodoCard } from './Card';
import Points from './Points';

function WeeklyGoals() {
  const [weekGoals, setWeekGoals] = useState([]);
  const [allGoals, setAllGoals] = useState([]);
  const { authUser } = useAuth();
  const [newGoals, setNewGoals] = useState(['']);
  const [selectedPoints, setSelectedPoints] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [refreshGoals, setRefreshGoals] = useState(true);
  const [activeTab, setActiveTab] = useState('thisWeek');

  useEffect(() => {
    if (authUser && refreshGoals) {
      fetchThisWeeksGoals(authUser.uid)
        .then((userWeekGoals) => {
          setWeekGoals(userWeekGoals);
          setRefreshGoals(false); // Reset the refresh flag after fetching
        })
        .catch((error) => {
          console.error('Error fetching this week\'s goals:', error);
        });
    }
  }, [authUser, refreshGoals]); // Add refreshGoals as a dependency

  useEffect(() => {
    if (authUser && refreshGoals) {
      fetchAllGoals(authUser.uid)
        .then((userAllGoals) => {
          setAllGoals(userAllGoals);
          setRefreshGoals(false); // Reset the refresh flag after fetching
        })
        .catch((error) => {
          console.error('Error fetching all goals:', error);
        });
    }
  }, [authUser, refreshGoals]); // Add refreshGoals as a dependency

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

  const fetchAllGoals = async (userId) => {
    try {
      if (!userId) return [];

      const q = query(
        goalsCollection,
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const allGoalsData = [];

      querySnapshot.forEach((doc) => {
        allGoalsData.push({ id: doc.id, ...doc.data() });
      });

      return allGoalsData;
    } catch (error) {
      console.error('Error fetching all goals: ', error);
      return [];
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
      setRefreshGoals(true);
    }
  };

  const handleGoalInputChange = (index, value) => {
    const updatedGoals = [...newGoals];
    updatedGoals[index] = value;
    setNewGoals(updatedGoals);
  };

  const handleChangeGoalStatus = async (goalId, currentStatus) => {
    const goalRef = doc(goalsCollection, goalId);
    const newStatus = currentStatus === 'complete' ? 'incomplete' : 'complete';
  
    // Update the status to the newStatus in both firebase and local state
    await updateDoc(goalRef, { status: newStatus });
    const updatedGoalDoc = await getDoc(goalRef);
    console.log('Updated goal document:', updatedGoalDoc.data());
    setRefreshGoals(true);
  
    // Update the local state to reflect the change and toggle the text
    setWeekGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId ? { ...goal, status: newStatus } : goal
      )
    );
  };
  
  const GoalsTable = ({ goals }) => {
    return (
      <div className="w-full py-4">
        <div className="w-full inline-block align-middle">
          <div className="rounded-lg overflow-hidden space-y-4">
          {goals.map((goal) => (
    <TodoCard 
        key={goal.id} 
        title={goal.text} 
        handleChangeGoalStatus={() => handleChangeGoalStatus(goal.id, goal.status)} 
        points={goal.assignedPoints} 
        goalId={goal.id} 
        status={goal.status}
    />
))}
          </div>
        </div>
      </div>
    );
  };

return (
  <div class ="w-full pt-10 px-4 sm:px-6 md:px-10 lg:pl-72 pb-10">
  {authUser && <Points userId={authUser.uid} />}
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
        <div className="fixed z-70 inset-0 overflow-y-auto mb-5" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity mb-5" aria-hidden="true"></div>
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
                            className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 mb-5"
                            placeholder={`Enter your goal ${index + 1}`}
                            value={goal}
                            onChange={(e) => handleGoalInputChange(index, e.target.value)}
                            style={{paddingLeft: '1rem', paddingRight: '1rem'}}
                          />
                          <label htmlFor="points-select" className="block text-sm mb-2 dark:text-white">Assign points</label>
                          <select
                            id="points-select"
                            name="points-select"
                            className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
  
  <div class="mt-3">
    <div className="flex justify-between items-center w-full mx-auto">
      <button
        type="button"
        className={activeTab === 'thisWeek' ? "py-2 px-4 inline-flex flex-shrink-0 justify-end items-center gap-2 rounded-md border border-black font-semibold bg-transparent text-black hover:bg-gray-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all text-lg" : "py-2 px-4 inline-flex flex-shrink-0 justify-end items-center gap-2 rounded-md border border-black font-semibold bg-transparent text-gray-500 hover:bg-gray-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all text-lg"}
        onClick={() => setActiveTab('thisWeek')}
      >
        This Week
      </button>
      <button
        type="button"
        className={activeTab === 'all' ? "py-2 px-4 inline-flex flex-shrink-0 justify-end items-center gap-2 rounded-md border border-black font-semibold bg-transparent text-black hover:bg-gray-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all text-lg" : "py-2 px-4 inline-flex flex-shrink-0 justify-end items-center gap-2 rounded-md border border-black font-semibold bg-transparent text-gray-500 hover:bg-gray-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all text-lg"}
        onClick={() => setActiveTab('all')}
      >
        All
      </button>
    </div>
    <div id="this-week-goals" class={activeTab === 'thisWeek' ? '' : 'hidden'} role="tabpanel" aria-labelledby="this-week-goals-tab">
      {weekGoals && weekGoals.length > 0 ? (
        <GoalsTable goals={weekGoals} />
      ) : (
        <p>No goals available for this week.</p>
      )}
    </div>
    <div id="all-goals" class={activeTab === 'all' ? '' : 'hidden'} role="tabpanel" aria-labelledby="all-goals-tab">
      {allGoals && allGoals.length > 0 ? (
        <GoalsTable goals={allGoals} />
      ) : (
        <p>No goals available.</p>
      )}
    </div>
  </div>
      
      

    </div>
    );
    
  }

export default WeeklyGoals;

