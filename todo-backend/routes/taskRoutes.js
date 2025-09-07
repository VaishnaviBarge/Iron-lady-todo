const express = require('express');
const router = express.Router();
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  aiSuggestTask,
  getTaskById,
  categorizeTask,
  generateDailySchedule,
  getProductivityInsights,
  searchTasks
} = require('../controllers/taskController');

// Basic CRUD routes
router.get('/', getTasks);
router.post('/', addTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/:id', getTaskById);

// AI-powered routes
router.post('/ai-suggest', aiSuggestTask);
router.post('/categorize', categorizeTask);
router.post('/generate-schedule', generateDailySchedule);
router.post('/productivity-insights', getProductivityInsights);
router.post('/search', searchTasks);

module.exports = router;