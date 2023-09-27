import React, { useState, useEffect } from 'react';
import { getDocs, query, where, addDoc } from 'firebase/firestore';
import { rewardsCollection } from '../firebaseUtils';
import { useAuth } from './AuthContext';

function Rewards() {
  const [unredeemedRewards, setUnredeemedRewards] = useState([]);
  const { authUser } = useAuth();
  const [newReward, setNewReward] = useState([]);

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
  }, [authUser, unredeemedRewards]); // Add unredeemedRewards as a dependency
  

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
        rewardName: trimmedReward, // Use the trimmed input value as rewardName
        timestamp: new Date(),
        userId: authUser.uid,
        redeemed: false,
        assignedPoints: 0,
      };

      try {
        await addDoc(rewardsCollection, rewardData);
        setNewReward(''); // Clear the input field by resetting the newReward state
        fetchUnredeemedRewards(authUser.uid);
      } catch (error) {
        console.error('Error adding reward: ', error);
      }
    }
  };
  


  // Render the goals in a table similar to your previous component
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {unredeemedRewards.map((reward) => (
                <tr key={reward.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{reward.rewardName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{reward.assignedPoints}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{reward.redeemed ? 'Redeemed' : 'Not Redeemed'}</td>
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
<label for="hs-trailing-button-add-on" class="sr-only">Label</label>
<div class="flex rounded-md shadow-sm">
  <input
    type="text"
    id="hs-trailing-button-add-on"
    name="hs-trailing-button-add-on"
    class="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-l-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
    value={newReward} // Bind the input value to newReward
    onChange={(e) => setNewReward(e.target.value)} // Update newReward when input changes
  />
  <button
    type="button"
    class="py-3 px-4 inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-r-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
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