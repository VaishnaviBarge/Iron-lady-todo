// components/SmartSearch.js
import React, { useState } from 'react';
import * as taskService from '../services/taskService';

const SearchResults = ({ results }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 border-red-300";
      case "medium": return "bg-yellow-100 border-yellow-300";
      case "low": return "bg-green-100 border-green-300";
      default: return "bg-gray-100 border-gray-300";
    }
  };

  if (!results) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Search Results</h3>
      
      {results.tasks && results.tasks.length > 0 ? (
        <div className="space-y-3">
          {results.tasks.map((task) => (
            <div key={task._id} className={`p-4 rounded-lg border-2 ${getPriorityColor(task.priority)}`}>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{task.title}</h4>
                {task.priority && (
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    task.priority === 'high' ? 'bg-red-500 text-white' :
                    task.priority === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {task.priority.toUpperCase()}
                  </span>
                )}
              </div>
              {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
              <div className="flex gap-4 text-sm text-gray-500 mt-2">
                {task.category && <span>📁 {task.category}</span>}
                {task.estimatedTime && <span>⏱️ {task.estimatedTime}</span>}
                {task.difficulty && <span>📊 {task.difficulty}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No matching tasks found.</p>
      )}
      
      {results.suggestions && results.suggestions.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">AI Suggestions</h4>
          <ul className="space-y-1">
            {results.suggestions.map((suggestion, index) => (
              <li key={`suggestion-${index}`} className="text-yellow-700">• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SmartSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await taskService.searchTasks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Smart Task Search</h2>
      
      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search tasks with AI (e.g., 'urgent work tasks', 'health related')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!searchQuery.trim() || loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-colors"
        >
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </form>
      
      {searchResults ? (
        <SearchResults results={searchResults} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">🔍 Intelligent Task Search</p>
          <p>Use natural language to find your tasks. Try phrases like:</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>• "urgent work tasks"</p>
            <p>• "health and fitness"</p>
            <p>• "learning projects"</p>
            <p>• "high priority items"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;