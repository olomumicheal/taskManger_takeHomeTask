import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Taskrouter from './routes/taskRoutes.js'; 

dotenv.config();

const PORT = process.env.PORT || 3000; 

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to  frontend's actual URL if different
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true // Allow cookies to be sent
}));


// routes
// All routes defined in Taskrouter will be prefixed with /api/task
app.use('/api/task', Taskrouter);

// Basic route for testing server status
app.get('/', (req, res) => {
    res.send('Task Management API is running!');
});


mongoose.connect(process.env.MONGODB_CONN)
    .then(() => {
        console.log('Database connected successfully.'); 
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`); 
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err); 
        process.exit(1); 
    });