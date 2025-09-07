// hooks/useTasks.js
import { useState, useEffect } from 'react';
import * as taskService from '../services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      console.error("Error adding task:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      setError(err.message);
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  const toggleTaskComplete = async (id, completed) => {
    try {
      const updatedTask = await taskService.updateTask(id, { completed: !completed });
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === id ? updatedTask : task)
      );
    } catch (err) {
      setError(err.message);
      console.error("Error toggling task completion:", err);
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refetchTasks: fetchTasks
  };
};

// hooks/useAI.js
export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSuggestion = async (taskTitle, taskDescription) => {
    setLoading(true);
    setError(null);
    try {
      const suggestion = await taskService.getAISuggestion(taskTitle, taskDescription);
      return suggestion;
    } catch (err) {
      setError(err.message);
      console.error("Error getting AI suggestion:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const schedule = await taskService.generateDailySchedule();
      return schedule;
    } catch (err) {
      setError(err.message);
      console.error("Error generating schedule:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const insights = await taskService.getProductivityInsights();
      return insights;
    } catch (err) {
      setError(err.message);
      console.error("Error getting insights:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchTasks = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await taskService.searchTasks(query);
      return results;
    } catch (err) {
      setError(err.message);
      console.error("Error searching tasks:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getSuggestion,
    generateSchedule,
    getInsights,
    searchTasks
  };
};

// hooks/useLocalStorage.js
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};