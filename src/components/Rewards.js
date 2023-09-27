import React, { useState, useEffect } from 'react';
import { getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { rewardsCollection } from '../firebaseUtils';
import { useAuth } from './AuthContext';

function Rewards() {
  const [unredeemedRewards, setUnredeemedRewards] = useState([]);
  const { authUser } = useAuth();
  const [newReward, setNewReward] = useState('');
  const [selectedPoints, setSelectedPoints] = useState(1);

  useEffect(() => {
    if (authUser) {
      fetchUnredeemedRewards(authUser.uid)
        .then((userUnredeemedGoals) => {
          setUnredeemedRewards(userUnredeemedGoals);
        })
        .catch((error) => {
          console.error('Error fetching this user rewards:', error);
        });
    }
  }, [authUser, unredeemedRewards]);

  const fetchUnredeemedRewards = async (userId) => {
    try {
      if (!userId) return [];
      const q = query(
        rewardsCollection,
        where('userId', '==', userId),
        where('redeemed', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const unredeemedRewardsData = [];

      querySnapshot.forEach((doc) => {
        unredeemedRewardsData.push({ id: doc.id, ...doc.data() });
      });

      return unredeemedRewardsData;
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
        await addDoc(rewardsCollection, rewardData);
        setNewReward('');
        setSelectedPoints(1);
        fetchUnredeemedRewards(authUser.uid);
      } catch (error) {
        console.error('Error adding reward: ', error);
      }
    }
  };

  const markRewardAsRedeemed = async (rewardId) => {
    try {
      const rewardRef = doc(rewardsCollection, rewardId);
      await updateDoc(rewardRef, { redeemed: true });
      fetchUnredeemedRewards(authUser.uid);
    } catch (error) {
      console.error('Error marking reward as redeemed: ', error);
    }
  };


  const UnredeemedRewardsTable = ({ rewards }) => {
    return (
      <div className="container mx-auto py-4">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg overflow-hidden dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reward</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {rewards.map((reward) => (
                  <tr key={reward.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{reward.rewardName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{reward.assignedPoints}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{reward.redeemed ? 'Redeemed' : 'Not Redeemed'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {!reward.redeemed && (
                        <button
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => markRewardAsRedeemed(reward.id)}
                        >
                          Mark Redeemed
                        </button>
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
      <label htmlFor="reward-input" className="sr-only">Reward</label>
      <div className="flex rounded-md shadow-sm">
        <input
          type="text"
          id="reward-input"
          name="reward-input"
          className="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-l-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
          value={newReward}
          onChange={(e) => setNewReward(e.target.value)}
          placeholder="Enter your reward"
        />
        <select
          id="points-select"
          name="points-select"
          className="py-3 px-4 block border-gray-200 shadow-sm rounded-r-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
          value={selectedPoints}
          onChange={(e) => setSelectedPoints(parseInt(e.target.value))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button
          type="button"
          className="py-3 px-4 inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-r-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          onClick={handleAddReward}
        >
          Add Reward
        </button>
      </div>

      {unredeemedRewards && unredeemedRewards.length > 0 ? (
        <UnredeemedRewardsTable rewards={unredeemedRewards} />
      ) : (
        <p>No rewards available.</p>
      )}
    </div>
  );
}

export default Rewards;
