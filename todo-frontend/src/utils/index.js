// utils/taskUtils.js

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high": return "bg-red-100 border-red-300";
    case "medium": return "bg-yellow-100 border-yellow-300";
    case "low": return "bg-green-100 border-green-300";
    default: return "bg-gray-100 border-gray-300";
  }
};

export const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case "high": return "bg-red-500 text-white";
    case "medium": return "bg-yellow-500 text-white";
    case "low": return "bg-green-500 text-white";
    default: return "bg-gray-500 text-white";
  }
};

export const getPriorityTextColor = (priority) => {
  switch (priority) {
    case "high": return "text-red-600";
    case "medium": return "text-yellow-600";
    case "low": return "text-green-600";
    default: return "text-gray-600";
  }
};

export const sortTasksByPriority = (tasks) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  return [...tasks].sort((a, b) => {
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;
    return bPriority - aPriority;
  });
};

export const filterTasksByStatus = (tasks, completed) => {
  return tasks.filter(task => task.completed === completed);
};

export const filterTasksByCategory = (tasks, category) => {
  return tasks.filter(task => task.category === category);
};

export const getTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    pending,
    completionRate
  };
};

// utils/dateUtils.js

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isOverdue = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

export const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// utils/validation.js

export const validateTaskTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, message: "Task title is required" };
  }
  if (title.trim().length < 3) {
    return { isValid: false, message: "Task title must be at least 3 characters" };
  }
  if (title.trim().length > 100) {
    return { isValid: false, message: "Task title must be less than 100 characters" };
  }
  return { isValid: true, message: "" };
};

export const validateTaskDescription = (description) => {
  if (description && description.length > 500) {
    return { isValid: false, message: "Description must be less than 500 characters" };
  }
  return { isValid: true, message: "" };
};

export const validatePriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(priority)) {
    return { isValid: false, message: "Priority must be low, medium, or high" };
  }
  return { isValid: true, message: "" };
};

// utils/constants.js

export const PRIORITY_OPTIONS = [
  { value: 'low', label: '🟢 Low Priority', color: 'green' },
  { value: 'medium', label: '🟡 Medium Priority', color: 'yellow' },
  { value: 'high', label: '🔴 High Priority', color: 'red' }
];

export const CATEGORY_OPTIONS = [
  'Work', 'Personal', 'Health', 'Learning', 'Shopping', 
  'Finance', 'Home', 'Social', 'Academic', 'Fitness'
];

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', icon: '😊' },
  { value: 'medium', label: 'Medium', icon: '😐' },
  { value: 'hard', label: 'Hard', icon: '😰' }
];

export const API_ENDPOINTS = {
  TASKS: '/api/tasks',
  AI_SUGGEST: '/api/tasks/ai-suggest',
  GENERATE_SCHEDULE: '/api/tasks/generate-schedule',
  PRODUCTIVITY_INSIGHTS: '/api/tasks/productivity-insights',
  SEARCH: '/api/tasks/search'
};