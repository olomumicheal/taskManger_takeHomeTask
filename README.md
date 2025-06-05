# Task Manager Application

A full-stack task manager built with **React (frontend)** and **Express + MongoDB (backend)**. Users can create, update, delete, and complete tasks.

## Features

- Add tasks with title and description
- Edit task details
- Delete tasks
- Mark tasks as complete
- MongoDB for persistent storage

## Tech Stack

- **Frontend**: React, Tailwind CSS, Axios, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Validation**: Zod
- **Tooling**: dotenv, nodemon, Toastify

## Getting Started

### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from `.env.example` and set your MongoDB URI:

```
MONGO_URI=mongodb://localhost:27017/task-manager
PORT=3000
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run at: `http://localhost:3000`

---

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from `.env.example` and set the base API URL:

```
VITE_API_BASE_URL=http://localhost:3000
```

4. Start the frontend dev server:

```bash
npm run dev
```

The frontend will run at: `http://localhost:5173`

---

## Notes

* No authentication – single-user mode
* Toast notifications used for UX feedback
* React components are modular and reusable
* Clean API structure with basic REST endpoints

## Improvements (To be added later)

* User authentication impementation
* filtering or sorting to be added
* Pagination Implementation
* Responsive design for mobile view (PWA)


## Author

*Micheal Olomu*

