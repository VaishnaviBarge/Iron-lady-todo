# Task Management App

A full-stack task management application built with React, Node.js, Express, MongoDB and Integrated with AI . This app allows users to create, read, update, and delete tasks with categories, priorities, and completion status.
![alt text](https://github.com/VaishnaviBarge/Iron-lady-todo/blob/main/todo.png?raw=true)

##  Features

- Create new tasks with title, description, priority, and category
- Edit existing tasks inline
- Groq AI Integration: Intelligent responses powered by LLaMA 3 model
- Mark tasks as complete/incomplete
- Delete tasks
- Organize tasks by categories (Work, Personal, Shopping, Health)
- Set task priorities (High, Medium, Low)
- Responsive design with modern UI
- Empty state with helpful messaging

##  Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling and responsive design
- **Modern JavaScript (ES6+)** - Language features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Groq** - SDK for AI integration
- **Mongoose** - MongoDB object modeling

##  Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas)
- [npm](https://www.npmjs.com/) 

##  Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-management-app.git
   cd task-management-app
   ```

2. **Install backend dependencies**
   ```bash
   cd todo-backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd todo-frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todo
   GROQ_API_KEY=your groq api key
   ```

##  Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npx nodemon server.js
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

##  API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Request/Response Examples

#### Create Task
```javascript
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "priority": "high",
  "category": "work"
}
```

#### Update Task
```javascript
PUT /api/tasks/605c72c5f3b5a2001f5e4e8a
Content-Type: application/json

{
  "title": "Updated task title",
  "completed": true
}
```

##  Data Models

### Task Schema
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  completed: Boolean (default: false),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  category: String (enum: ['personal', 'work', 'shopping', 'health'], default: 'personal'),
  createdAt: Date,
  updatedAt: Date
}
```

##  UI Components

### TaskList
- Displays all tasks in a responsive grid
- Shows empty state when no tasks exist
- Handles task operations (edit, delete, toggle completion)

### TaskItem
- Individual task display with inline editing
- Priority and category badges with color coding
- Completion checkbox and action buttons
- Smooth transitions and hover effects

### TaskForm
- Clean form for creating new tasks
- Input validation and error handling
- Dropdown selections for priority and category

##  Category System

The app supports four main categories:
- **Personal** - Personal tasks and reminders
- **Work** - Professional and work-related tasks
- **Shopping** - Shopping lists and purchases
- **Health** - Health and fitness related tasks

##  Acknowledgments

- React team for the amazing UI library
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the flexible database solution
- Express.js community for the minimal web framework

##  Contact

Your Name - vaishnavibarge0@gmail.com

Linkdin : www.linkedin.com/in/vaishnavi-barge

---
