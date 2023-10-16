import React, { useState, useEffect } from 'react';
import { getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { rewardsCollection } from '../firebaseUtils';
import { useAuth } from './AuthContext';

function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [unredeemedRewards, setUnredeemedRewards] = useState([]);
  const { authUser } = useAuth();
  const [newReward, setNewReward] = useState('');
  const [selectedPoints, setSelectedPoints] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (authUser) {
      fetchRewards(authUser.uid)
        .then((userRewards) => {
          setRewards(userRewards);
          const redeemed = userRewards.filter(reward => reward.redeemed);
          const unredeemed = userRewards.filter(reward => !reward.redeemed);
          setRedeemedRewards(redeemed);
          setUnredeemedRewards(unredeemed);
        })
        .catch((error) => {
          console.error('Error fetching this user rewards:', error);
        });
    }
  }, [authUser]);


  const fetchRewards = async (userId) => {
    try {
      if (!userId) return [];
      const q = query(
        rewardsCollection,
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const rewardsData = [];

      querySnapshot.forEach((doc) => {
        rewardsData.push({ id: doc.id, ...doc.data() });
      });

      return rewardsData;
    } catch (error) {
      console.error('Error fetching rewards: ', error);
      return [];
    }
  };

  const handleAddReward = async () => {
    const trimmedReward = newReward.trim();
    if (trimmedReward && authUser) {
      const rewardData = {
        rewardName: trimmedReward,
        timestamp: new Date(),
        userId: authUser.uid,
        redeemed: false,
        assignedPoints: selectedPoints,
      };
  
      try {
        const docRef = await addDoc(rewardsCollection, rewardData);
        setNewReward('');
        setSelectedPoints(1);
        setRewards(oldRewards => [...oldRewards, { id: docRef.id, ...rewardData }]);
        setShowModal(false);
      } catch (error) {
        console.error('Error adding reward: ', error);
      }
    }
  };

  const markRewardAsRedeemed = async (rewardId) => {
    try {
      const rewardRef = doc(rewardsCollection, rewardId);
      await updateDoc(rewardRef, { redeemed: true });
      setRewards(oldRewards => oldRewards.map(reward => reward.id === rewardId ? { ...reward, redeemed: true } : reward));
    } catch (error) {
      console.error('Error marking reward as redeemed: ', error);
    }
  };

  function RewardCard({ reward, onRedeem }) {
    return (
      <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7] w-full">
        <div className="md:p-5">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {reward.rewardName}
          </h3>
          <p className="mt-2 text-gray-800 dark:text-gray-400">
            Assigned Points: {reward.assignedPoints}
          </p>
          {!reward.redeemed && (
            <button
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-700"
              onClick={() => onRedeem(reward.id)}
            >
              Mark as Redeemed
              <svg className="w-2.5 h-auto" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  function RewardsTable({ rewards, onRedeem }) {
    return (
      <div className="flex flex-wrap gap-4 w-full mx-auto">
        {rewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} onRedeem={onRedeem} />
        ))}
      </div>
    );
  }

  return (
    <div class ="w-full pt-10 px-4 sm:px-6 md:px-10 lg:pl-72 pb-10">
      <div className="flex justify-between items-center w-full mx-auto">
        <h1 className="text-3xl font-semibold">Rewards</h1>
        <button
          type="button"
          className="py-2 px-4 inline-flex flex-shrink-0 justify-end items-center gap-2 rounded-md border border-black font-semibold bg-transparent text-black hover:bg-gray-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all text-lg"
          onClick={() => setShowModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Reward
        </button>
      </div>

      {showModal ? (
        <div className="fixed z-10 inset-0 overflow-y-auto mb-5" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity mb-5" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen mb-5" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left mb-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5" id="modal-title">
                      Add Reward
                    </h3>
                    <div className="mt-2">
                      <label htmlFor="reward-input" className="block text-sm mb-2 dark:text-white">Enter your reward</label>
                      <input
                        type="text"
                        id="reward-input"
                        name="reward-input"
                        className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 mb-5"
                        value={newReward}
                        onChange={(e) => setNewReward(e.target.value)}
                        placeholder="Enter your reward"
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
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-semibold text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddReward}
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

<h2 className="text-2xl font-semibold mt-8">Unredeemed Rewards</h2>
      {unredeemedRewards && unredeemedRewards.length > 0 ? (
        <RewardsTable rewards={unredeemedRewards} onRedeem={markRewardAsRedeemed} />
      ) : (
        <p>No unredeemed rewards available.</p>
      )}

      <h2 className="text-2xl font-semibold mt-8">Redeemed Rewards</h2>
      {redeemedRewards && redeemedRewards.length > 0 ? (
        <RewardsTable rewards={redeemedRewards} onRedeem={markRewardAsRedeemed} />
      ) : (
        <p>No redeemed rewards available.</p>
      )}
      </div>
  );
}

export default Rewards;


