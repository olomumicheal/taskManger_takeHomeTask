import React, { useState } from "react";
import { z, ZodError } from 'zod';
import { getZodError } from "../helper/getZodError";
import { showToast } from "../helper/showToast";
import { useSpring, animated } from '@react-spring/web'; 

const HomePage = () => {
    const [formData, setFormData] = useState({});
    const [err, setError] = useState(null);

    const taskSchema = z.object({
        title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
        description: z.string().min(3, { message: "Description must be at least 3 characters long." }).max(500, { message: 'Description cannot exceed 500 characters.' })
    });

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (err && err[e.target.name]) {
            setError(prevErr => ({ ...prevErr, [e.target.name]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const validatedData = taskSchema.parse(formData);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/create-task`,
                {
                    method: "POST",
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(validatedData)
                });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || 'Something went wrong on the server.');
            }
            setFormData({});
            showToast('success', responseData.message);
        } catch (error) {
            if (error instanceof ZodError) {
                const getError = getZodError(error.errors);
                setError(getError);
                showToast('error', Object.values(getError)[0]);
            } else {
                showToast('error', error.message || 'An unexpected error occurred.');
            }
        }
    };

    // Animation for the main card (fade in and slight scale)
    const cardAnimation = useSpring({
        from: { opacity: 0, transform: 'scale(0.95)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: { tension: 200, friction: 20 }, 
    });

    // Animation for form elements (staggered fade in from bottom)
    const formFieldAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 200, friction: 25 },
        delay: 100 // Stagger delay for each field
    });

    const buttonAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0px)' },
        config: { tension: 200, friction: 25 },
        delay: 300 // Slightly delayed for the button
    });

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <animated.div // Apply animation to the main card container
                style={cardAnimation}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Add New Task</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <animated.div style={formFieldAnimation}> {/* Animate title field */}
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
                            placeholder="e.g., Plan marketing campaign"
                        />
                        {err?.title && <span className="text-red-500 text-xs mt-1 block">{err.title}</span>}
                    </animated.div>

                    <animated.div style={{ ...formFieldAnimation, delay: formFieldAnimation.delay + 100 }}> {/* Animate description field with slight delay */}
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
                            placeholder="Describe your task in detail..."
                        ></textarea>
                        {err?.description && <span className="text-red-500 text-xs mt-1 block">{err.description}</span>}
                    </animated.div>

                    <animated.button // Animate the submit button
                        style={buttonAnimation}
                        type="submit"
                        className="w-full text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md px-5 py-3 text-center shadow-md transition duration-200 ease-in-out transform hover:-translate-y-0.5"
                    >
                        Add Task
                    </animated.button>
                </form>
            </animated.div>
        </div>
    );
};

export default HomePage;