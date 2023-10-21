import React from 'react'
import clsx from 'clsx'

export const TodoCard = ({ title, checked, points, goalId, currentStatus, handleChangeGoalStatus }) => {
    const [check, setChecked] = React.useState(checked);
    const [status, setStatus] = React.useState(currentStatus);
  
    const unselectedStyle = "bg-white rounded-xl p-4";
    const selectedStyle = "bg-orange-600 rounded-xl p-4";
  
    const handleStatusChange = () => {
        const newStatus = status === 'complete' ? 'incomplete' : 'complete';
        handleChangeGoalStatus(goalId, newStatus);
        setStatus(newStatus);
        setChecked(newStatus === 'complete');
    };
  
    return (
      <div className={`flex flex-col ${check ? selectedStyle : unselectedStyle} border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7] w-full`}>
        <div className="md:p-5">
          <div className="flex space-x-4 items-center mb-4">
            <input type="checkbox" checked={check} onChange={handleStatusChange} />
            <h3 className={`text-lg font-bold text-gray-800 dark:text-white ${clsx(check && "line-through")}`}>{title}</h3>
          </div>
          <p className={`mt-2 text-gray-800 dark:text-gray-400 ${clsx(check ? "text-slate" : "text-orange-400")}`}><b>{points} points</b></p>
        </div>
      </div>
    );
  };