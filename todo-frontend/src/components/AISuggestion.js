// components/AISuggestion.js
import React from 'react';

const AISuggestion = ({ suggestion, userPriority }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  // Don't render if no suggestion
  if (!suggestion) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border border-purple-200">
      <h3 className="font-bold text-purple-800 mb-2">🤖 AI Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Suggestion:</strong> {suggestion.suggestion || 'No suggestion available'}
        </div>
        
        <div>
          <strong>Your Priority:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getPriorityStyle(userPriority)}`}>
            {userPriority?.toUpperCase() || 'NOT SET'}
          </span>
        </div>
        
        <div>
          <strong>Estimated Time:</strong> {suggestion.estimatedTime || 'Not specified'}
        </div>
        
        <div>
          <strong>Difficulty:</strong> {suggestion.difficulty || 'Not specified'}
        </div>
        
        {suggestion.category && (
          <div>
            <strong>Category:</strong> {suggestion.category}
          </div>
        )}
        
        {suggestion.subtasks && suggestion.subtasks.length > 0 && (
          <div className="md:col-span-2">
            <strong>Subtasks:</strong>
            <ul className="ml-4 mt-1">
              {suggestion.subtasks.map((subtask, i) => (
                <li key={i} className="text-gray-600">• {subtask}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestion;