import React from 'react'
import clsx from 'clsx'

export const TodoCard = ({ title, checked, points, goalId, currentStatus, handleChangeGoalStatus }) => {
    const [check, setChecked] = React.useState(checked);
    const [status, setStatus] = React.useState(currentStatus);
  
    const unselectedStyle = "bg-slate-900 rounded-xl p-4";
    const selectedStyle = "bg-orange-600 rounded-xl p-4";
  
    const handleStatusChange = () => {
        const newStatus = status === 'complete' ? 'incomplete' : 'complete';
        handleChangeGoalStatus(goalId, newStatus);
        setStatus(newStatus);
        setChecked(newStatus === 'complete');
    };
  
    return (
      <div className={clsx(check ? selectedStyle : unselectedStyle)}>
        <div className="flex space-x-4 items-center mb-4">
          <input type="checkbox" checked={check} onChange={handleStatusChange} />
          <div className={clsx("text-white", check && "line-through")}>{title}</div>
        </div>
        <div className={clsx(check ? "text-white" : "text-orange-400")}>{points} points</div>
      </div>
    );
  };