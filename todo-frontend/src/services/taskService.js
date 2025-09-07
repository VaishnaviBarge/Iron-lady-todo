// services/taskService.js
const API_URL = "http://localhost:5000/api/tasks";

// Helper function for API requests
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Get all tasks
export const getAllTasks = async () => {
  return await apiRequest(API_URL);
};

// Create a new task
export const createTask = async (taskData) => {
  return await apiRequest(API_URL, {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

// Update a task
export const updateTask = async (id, updates) => {
  return await apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

// Delete a task
export const deleteTask = async (id) => {
  return await apiRequest(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};

// Get AI suggestion for a task
export const getAISuggestion = async (taskTitle, taskDescription) => {
  return await apiRequest(`${API_URL}/ai-suggest`, {
    method: "POST",
    body: JSON.stringify({ taskTitle, taskDescription }),
  });
};

// Generate daily schedule
export const generateDailySchedule = async () => {
  return await apiRequest(`${API_URL}/generate-schedule`, {
    method: "POST",
  });
};

// Get productivity insights
export const getProductivityInsights = async () => {
  return await apiRequest(`${API_URL}/productivity-insights`, {
    method: "POST",
  });
};

// Search tasks
export const searchTasks = async (query) => {
  return await apiRequest(`${API_URL}/search`, {
    method: "POST",
    body: JSON.stringify({ query }),
  });
};