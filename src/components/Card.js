import React from 'react'
import clsx from 'clsx'

export const TodoCard = (
    {title, checked, points}
) => {

    const [check, setChecked] = React.useState(checked)

    const unselectedStyle = "bg-gray-900 rounded-xl p-4"
    const selectedStyle = "bg-purple-400 rounded-xl p-4"

 return (
    <div className={clsx(check?selectedStyle:unselectedStyle)}>
    <div className="flex space-x-4 items-center mb-4">
        <input type="checkbox" checked={check} onClick={()=>{setChecked(!check)}}/>
        <div className={clsx("text-white", check && "line-through")}>{title}</div>
        </div>
        <div className={clsx(check?"text-white":"text-purple-400")}>{points} points</div>
    </div>
    )
}