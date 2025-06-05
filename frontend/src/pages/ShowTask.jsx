import React, { useEffect, useState } from "react";
import { z, ZodError } from 'zod';
import { getZodError } from "../helper/getZodError";
import { showToast } from "../helper/showToast";
import { useParams } from "react-router-dom";
import { useSpring, animated } from '@react-spring/web'; 

const ShowTask = () => {
    const { taskid } = useParams();
    const [apiData, setApiData] = useState(null); // Initialize as null
    const [formData, setFormData] = useState({}); // Initialize as an empty object
    const [err, setError] = useState(null); // Initialize as null
    const [loading, setLoading] = useState(true); // State to manage loading

    const taskSchema = z.object({
        title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
        description: z.string().min(3, { message: "Description must be at least 3 characters long." }).max(500, { message: 'Description cannot exceed 500 characters.' }),
        status: z.enum(['Pending', 'Running', 'Completed', 'Failed'], { message: "Invalid status selected." })
    });

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear specific error when user starts typing/changing in that field
        if (err && err[e.target.name]) {
            setError(prevErr => ({ ...prevErr, [e.target.name]: undefined }));
        }
    };

    useEffect(() => {
        const getTask = async () => {
            setLoading(true); // Start loading
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/show-task/${taskid}`);
                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Failed to fetch task details.');
                }
                setApiData(responseData);
                setFormData(responseData.taskData);
            } catch (error) {
                showToast('error', error.message || 'An error occurred while fetching task.');
                setApiData({ status: false, message: error.message || 'Task not found or an error occurred.' }); // Set error state for UI
            } finally {
                setLoading(false); // End loading
            }
        };
        getTask();
    }, [taskid]); // Depend on taskid to refetch if it changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        try {
            const validatedData = taskSchema.parse(formData);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update-task/${taskid}`,
                {
                    method: "PUT",
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(validatedData)
                });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Something went wrong during update.');
            }

            showToast('success', responseData.message);
            // Optionally, update apiData with the new formData if the API response doesn't return the updated task
            setApiData(prevApiData => ({ ...prevApiData, taskData: validatedData }));

        } catch (error) {
            if (error instanceof ZodError) {
                const getError = getZodError(error.errors);
                setError(getError);
                showToast('error', Object.values(getError)[0] || 'Please correct the form errors.');
            } else {
                showToast('error', error.message || 'An unexpected error occurred.');
            }
        }
    };

    // Animation for the main card (fade in and slight scale)
    const cardAnimation = useSpring({
        from: { opacity: 0, transform: 'scale(0.95)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: { tension: 200, friction: 20 }, // Adjust for desired springiness
    });

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {loading ? (
                <div className="text-center py-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading task details...</p>
                </div>
            ) : (
                !apiData || !apiData.status ? ( // Check apiData.status explicitly for error/not found
                    <div className="bg-red-50 p-8 rounded-xl shadow-lg text-center w-full max-w-md border border-red-300 text-red-700">
                        <h2 className="text-2xl font-bold mb-4">Error!</h2>
                        <p>{apiData?.message || 'Task not found or could not be loaded.'}</p>
                    </div>
                ) : (
                    <animated.div // Apply animation to the main card container
                        style={cardAnimation}
                        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
                    >
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Task Details</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
                                    Task Title
                                </label>
                                <input
                                    value={formData.title || ''}
                                    onChange={handleInput}
                                    name="title"
                                    type="text"
                                    id="title"
                                    className={`bg-gray-50 border ${err?.title ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-200 ease-in-out`}
                                    placeholder="e.g., Finalize project report"
                                />
                                {err?.title && <span className="text-red-500 text-xs mt-1 block">{err.title}</span>}
                            </div>

                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                                    Task Description
                                </label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={handleInput}
                                    name="description"
                                    id="description"
                                    rows="5"
                                    className={`block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${err?.description ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out`}
                                    placeholder="Provide a detailed description of the task..."
                                ></textarea>
                                {err?.description && <span className="text-red-500 text-xs mt-1 block">{err.description}</span>}
                            </div>

                            <div>
                                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">
                                    Task Status
                                </label>
                                <select
                                    onChange={handleInput}
                                    name="status"
                                    id="status"
                                    value={formData.status || ''} // Use value prop for controlled component
                                    className={`block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${err?.status ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out`}
                                >
                                    <option value="">Select Status</option> {/* Added a default placeholder option */}
                                    <option value="Pending">Pending</option>
                                    <option value="Running">Running</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Failed">Failed</option>
                                </select>
                                {err?.status && <span className="text-red-500 text-xs mt-1 block">{err.status}</span>}
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md px-5 py-3 text-center shadow-md transition duration-200 ease-in-out transform hover:-translate-y-0.5"
                            >
                                Update Task
                            </button>
                        </form>
                    </animated.div>
                )
            )}
        </div>
    );
};

export default ShowTask;