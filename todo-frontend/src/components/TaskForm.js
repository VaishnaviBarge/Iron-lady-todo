// components/TaskForm.js
import React, { useState } from 'react';
import * as taskService from '../services/taskService';
import AISuggestion from './AISuggestion';

const TaskForm = ({ onAddTask, loading }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [userPriority, setUserPriority] = useState("medium");
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      let taskData = {
        title: taskTitle,
        description: taskDescription,
        priority: userPriority,
      };

      // If we have AI suggestion, include it
      if (aiSuggestion) {
        taskData = {
          ...taskData,
          estimatedTime: aiSuggestion.estimatedTime,
          category: aiSuggestion.category,
          subtasks: aiSuggestion.subtasks,
          difficulty: aiSuggestion.difficulty,
        };
      }

      await onAddTask(taskData);
      
      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setUserPriority("medium");
      setAiSuggestion(null);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const handleAiAnalyze = async () => {
    if (!taskTitle.trim()) return;
    
    setAiLoading(true);
    try {
      const suggestion = await taskService.getAISuggestion(taskTitle, taskDescription);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <textarea
          placeholder="Task Description (optional)"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="p-3 border rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Priority Level:</label>
          <select
            value={userPriority}
            onChange={(e) => setUserPriority(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAiAnalyze}
            disabled={!taskTitle.trim() || aiLoading}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
          >
            {aiLoading ? "Getting AI Suggestion..." : "🧠 AI Analyze"}
          </button>
          
          <button
            type="submit"
            disabled={!taskTitle.trim() || loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-colors"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>

      {aiSuggestion && (
        <AISuggestion 
          suggestion={aiSuggestion} 
          userPriority={userPriority}
        />
      )}
    </div>
  );
};

export default TaskForm;