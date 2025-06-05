import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Task from "../components/Task";
import { showToast } from "../helper/showToast";
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useSpring, animated } from '@react-spring/web'; 

const TaskListPage = () => {
    const [refresh, setRefresh] = useState(false);
    const [tasks, setTasks] = useState(null);
    const [loading, setLoading] = useState(true);

    // Animation for the main container (fade in and slight scale)
    const listContainerAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 200, friction: 20 },
    });

    useEffect(() => {
        const getTasks = async () => {
            setLoading(true);
            setRefresh(false); // Reset refresh flag
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/get-all-task`);
                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Failed to fetch tasks.');
                }
                setTasks(responseData);
            } catch (error) {
                showToast('error', error.message || 'An error occurred while fetching tasks.');
                setTasks({ status: false, message: error.message || 'Could not load tasks.' });
            } finally {
                setLoading(false);
            }
        };
        getTasks();
    }, [refresh]);

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/delete-task/${taskId}`, {
                method: 'DELETE'
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to delete task.');
            }
            setRefresh(true); // Trigger a refresh to re-fetch tasks
            showToast('success', responseData.message);
        } catch (error) {
            showToast('error', error.message || 'An unexpected error occurred during deletion.');
        }
    };

    // New handler for marking tasks as complete
    const toggleTaskComplete = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed'; // Toggle logic
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update-task/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ status: newStatus }) // Only sending status for this specific action
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update task status.');
            }
            setRefresh(true); // Trigger a refresh to re-fetch tasks with updated status
            showToast('success', responseData.message || `Task marked as ${newStatus}.`);
        } catch (error) {
            showToast('error', error.message || 'An unexpected error occurred while updating task status.');
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="text-center py-10 w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <animated.div
                style={listContainerAnimation}
                className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8"
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">My Tasks</h1>
                    <Link
                        to="/add-task"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
                    >
                        <PlusCircleIcon className="h-5 w-5" />
                        <span>Add New</span>
                    </Link>
                </div>

                {tasks && tasks.status && tasks.taskData ? (
                    tasks.taskData.length > 0 ? (
                        <div className="space-y-4">
                            {tasks.taskData.map((task) => (
                                <Task
                                    key={task._id}
                                    task={task}
                                    onDelete={deleteTask}
                                    onToggleComplete={toggleTaskComplete} // Pass the new handler
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No tasks found. Time to create one!</p>
                            <Link
                                to="/add-task"
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Create First Task
                            </Link>
                        </div>
                    )
                ) : (
                    <div className="text-center py-10 bg-red-50 rounded-lg border border-red-300 text-red-700">
                        <p className="text-lg font-semibold mb-2">Failed to load tasks!</p>
                        <p>{tasks?.message || "An unexpected error occurred."}</p>
                    </div>
                )}
            </animated.div>
        </div>
    );
};

export default TaskListPage;