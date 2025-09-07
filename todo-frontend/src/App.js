import { useState, useEffect } from "react";
import TaskManager from "./components/TaskManager.js";
import DailySchedule from "./components/DailySchedule";
import ProductivityInsights from "./components/ProductivityInsights";
import SmartSearch from "./components/SmartSearch";
import TabNavigation from "./components/TabNavigation";
import * as taskService from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const [loading, setLoading] = useState(false);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task handler
  const handleAddTask = async (taskData) => {
    setLoading(true);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update task handler
  const handleUpdateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task handler
  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion handler
  const handleToggleComplete = async (id, completed) => {
    try {
      const updatedTask = await taskService.updateTask(id, { completed: !completed });
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const tabs = [
    { id: "tasks", label: "Tasks" },
    { id: "schedule", label: "Daily Schedule" },
    { id: "insights", label: "Insights" },
    { id: "search", label: "Smart Search" }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "tasks":
        return (
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onUpdateTask={handleUpdateTask}
            loading={loading}
          />
        );
      case "schedule":
        return <DailySchedule />;
      case "insights":
        return <ProductivityInsights />;
      case "search":
        return <SmartSearch />;
      default:
        return <TaskManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          🤖 AI-Powered Todo App
        </h1>

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {renderActiveTab()}
      </div>
    </div>
  );
}

export default App;