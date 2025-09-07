// components/TaskItem.js
import React, { useState } from 'react';

const TaskItem = ({ task, onDelete, onToggleComplete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    estimatedTime: task.estimatedTime || '',
    difficulty: task.difficulty || '',
    category: task.category || '',
    subtasks: task.subtasks ? task.subtasks.join('\n') : ''
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 border-red-300";
      case "medium": return "bg-yellow-100 border-yellow-300";
      case "low": return "bg-green-100 border-green-300";
      default: return "bg-gray-100 border-gray-300";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    const updatedTask = {
      ...editForm,
      subtasks: editForm.subtasks 
        ? editForm.subtasks.split('\n').filter(subtask => subtask.trim()) 
        : []
    };

    onUpdate(task._id, updatedTask);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      estimatedTime: task.estimatedTime || '',
      difficulty: task.difficulty || '',
      category: task.category || '',
      subtasks: task.subtasks ? task.subtasks.join('\n') : ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isEditing) {
    return (
      <div className={`p-4 rounded-lg shadow border-2 ${getPriorityColor(editForm.priority)}`}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Task title"
              required
            />
          </div>
          
          <div>
            <textarea
              value={editForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description (optional)"
              rows="2"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={editForm.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
              <input
                type="text"
                value={editForm.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={editForm.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={editForm.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Work, Personal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtasks (one per line)</label>
            <textarea
              value={editForm.subtasks}
              onChange={(e) => handleInputChange('subtasks', e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter each subtask on a new line"
              rows="3"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleEditCancel}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg shadow border-2 transition-all ${getPriorityColor(task.priority)} ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={onToggleComplete}
              className="w-5 h-5 cursor-pointer"
            />
            
            <h3 className={`text-lg font-semibold ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            
            {task.priority && (
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityBadgeColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>
            )}
          </div>
          
          {task.description && (
            <p className="text-gray-600 mb-2">{task.description}</p>
          )}
          
          <div className="flex gap-4 text-sm text-gray-500">
            {task.estimatedTime && <span>⏱️ {task.estimatedTime}</span>}
            {task.difficulty && <span>📊 {task.difficulty}</span>}
            {task.category && <span>📁 {task.category}</span>}
          </div>
          
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-600">Subtasks:</p>
              <ul className="ml-4 text-sm text-gray-500">
                {task.subtasks.map((subtask, index) => (
                  <li key={index}>• {subtask}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;