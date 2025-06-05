import TaskModel from "../models/taskModel.js"

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        // Basic validation (more robust validation is handled by Zod on frontend)
        if (!title || !description) {
            return res.status(400).json({ status: false, message: 'Title and description are required.' });
        }

        const newTask = new TaskModel({
            title,
            description,
            status: "Pending" // Ensure new tasks start as Pending
        });
        await newTask.save();

        res.status(201).json({ // 201 Created for successful resource creation
            status: true,
            message: 'Task created successfully.',
            task: newTask // Optionally return the created task
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({
            status: false,
            message: error.message || 'Failed to create task.'
        });
    }
};

// Get all tasks
export const getAllTask = async (req, res) => {
    try {
        const taskData = await TaskModel.find().sort({ createdAt: -1 }).lean().exec();

        res.status(200).json({
            status: true,
            taskData
        });
    } catch (error) {
        console.error("Error getting all tasks:", error);
        res.status(500).json({
            status: false,
            message: error.message || 'Failed to retrieve tasks.'
        });
    }
};

// Get a single task by ID
export const showTask = async (req, res) => {
    try {
        const { taskid } = req.params;
        const taskData = await TaskModel.findById(taskid).lean().exec();

        if (!taskData) {
            return res.status(404).json({ status: false, message: 'Task not found.' });
        }

        res.status(200).json({
            status: true,
            taskData
        });
    } catch (error) {
        console.error("Error showing task:", error);
        // Handle invalid MongoDB ID format
        if (error.name === 'CastError') {
            return res.status(400).json({ status: false, message: 'Invalid Task ID format.' });
        }
        res.status(500).json({
            status: false,
            message: error.message || 'Failed to retrieve task.'
        });
    }
};

// Update an existing task
export const updateTask = async (req, res) => {
    try {
        const { taskid } = req.params;
        const { title, description, status } = req.body;

        // Basic validation for update
        if (!title && !description && !status) {
            return res.status(400).json({ status: false, message: 'No fields provided for update.' });
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(
            taskid,
            { title, description, status }, // Only update provided fields
            { new: true, runValidators: true } // new: true returns the updated document; runValidators: true runs schema validators
        ).lean().exec();

        if (!updatedTask) {
            return res.status(404).json({ status: false, message: 'Task not found for update.' });
        }

        res.status(200).json({
            status: true,
            message: 'Task updated successfully.',
            taskData: updatedTask // Return the updated task data
        });
    } catch (error) {
        console.error("Error updating task:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ status: false, message: 'Invalid Task ID format.' });
        }
        // Handle Mongoose validation errors (e.g., enum mismatch for status)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: false, message: error.message });
        }
        res.status(500).json({
            status: false,
            message: error.message || 'Failed to update task.'
        });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const { taskid } = req.params;

        const deletedTask = await TaskModel.findByIdAndDelete(taskid).lean().exec();

        if (!deletedTask) {
            return res.status(404).json({ status: false, message: 'Task not found for deletion.' });
        }

        res.status(200).json({
            status: true,
            message: 'Task deleted successfully.',
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ status: false, message: 'Invalid Task ID format.' });
        }
        res.status(500).json({
            status: false,
            message: error.message || 'Failed to delete task.'
        });
    }
};