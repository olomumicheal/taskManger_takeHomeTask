// src/components/Task.jsx
import React, { useMemo } from 'react'; // Removed useEffect, useState as badgecolor now uses useMemo directly
import Badge from './Badge';
import { Link } from 'react-router-dom';
import { EyeIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // Add CheckCircleIcon

const Task = ({ task, onDelete, onToggleComplete }) => { // Added onToggleComplete prop
    const badgecolor = useMemo(() => {
        switch (task.status) {
            case 'Pending':
                return 'blue';
            case 'Running':
                return 'yellow';
            case 'Completed':
                return 'green';
            case 'Failed':
                return 'red';
            default:
                return 'gray'; // Fallback color
        }
    }, [task.status]);

    const handleDelete = () => {
        onDelete(task._id);
    };

    const handleToggleComplete = () => {
        // Call the passed function with the task ID and current status to toggle
        onToggleComplete(task._id, task.status);
    };

    // Determine task card styling based on completion status
    const isCompleted = task.status === 'Completed';

    return (
        <div className={`
            bg-white rounded-lg shadow-md p-6 border
            ${isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'}
            hover:shadow-lg transition-all duration-200 ease-in-out
        `}>
            <div className="flex items-start justify-between mb-3">
                <h3 className={`
                    text-xl font-bold text-gray-900 flex-grow pr-4
                    ${isCompleted ? 'line-through text-gray-500' : ''} {/* Add line-through for completed */}
                `}>
                    {task.title}
                </h3>
                <Badge color={badgecolor} text={task.status} />
            </div>
            <p className={`
                text-gray-700 text-base mb-4 line-clamp-3
                ${isCompleted ? 'line-through text-gray-500' : ''} {/* Add line-through for completed */}
            `}>
                {task.description}
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                    onClick={handleToggleComplete}
                    className={`
                        inline-flex items-center px-4 py-2 rounded-md font-medium text-sm shadow-sm
                        ${isCompleted
                            ? 'bg-gray-400 hover:bg-gray-500 text-white' // Gray if completed
                            : 'bg-green-600 hover:bg-green-700 text-white' // Green if not completed
                        }
                        focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${isCompleted ? 'focus:ring-gray-300' : 'focus:ring-green-500'}
                        transition-all duration-200 ease-in-out
                    `}
                    disabled={isCompleted} // Disable if already completed
                >
                    <CheckCircleIcon className="w-5 h-5 mr-1" />
                    {isCompleted ? 'Completed' : 'Mark Complete'}
                </button>

                <Link
                    to={`/show-task/${task._id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                >
                    <EyeIcon className="w-5 h-5 mr-1" />
                    View
                </Link>
                <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md font-medium text-sm shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 ease-in-out"
                >
                    <TrashIcon className="w-5 h-5 mr-1" />
                    Delete
                </button>
            </div>
        </div>
    );
};

export default Task;