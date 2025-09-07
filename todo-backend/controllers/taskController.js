const Task = require("../models/Task");
const { ChatGroq } = require("@langchain/groq");

// Define allowed categories (should match your Task model enum)
const ALLOWED_CATEGORIES = [
  'Work', 'Personal', 'Health', 'Learning', 'Shopping', 
  'Finance', 'Home', 'Social', 'Academic', 'Fitness'
];

// Initialize Groq client
const initGroqClient = () => {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
    temperature: 0,
    max_tokens: 5000,
    maxRetries: 5,
  });
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add task with validation
const addTask = async (req, res) => {
  try {
    // Validate category if provided
    if (req.body.category && !ALLOWED_CATEGORIES.includes(req.body.category)) {
      // Map to closest valid category or use default
      req.body.category = mapToValidCategory(req.body.category);
    }

    // Validate priority if provided
    const validPriorities = ['low', 'medium', 'high'];
    if (req.body.priority && !validPriorities.includes(req.body.priority)) {
      req.body.priority = 'medium'; // Default fallback
    }

    const task = new Task(req.body);
    console.log("req.body ", req.body);
    console.log("task ", task);
    
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Add Task Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to map invalid categories to valid ones
const mapToValidCategory = (invalidCategory) => {
  const categoryMap = {
    'academic': 'Learning',
    'study': 'Learning',
    'education': 'Learning',
    'school': 'Learning',
    'university': 'Learning',
    'work': 'Work',
    'job': 'Work',
    'office': 'Work',
    'business': 'Work',
    'personal': 'Personal',
    'family': 'Personal',
    'health': 'Health',
    'medical': 'Health',
    'fitness': 'Fitness',
    'exercise': 'Fitness',
    'gym': 'Fitness',
    'shopping': 'Shopping',
    'buy': 'Shopping',
    'purchase': 'Shopping',
    'finance': 'Finance',
    'money': 'Finance',
    'banking': 'Finance',
    'home': 'Home',
    'house': 'Home',
    'household': 'Home',
    'social': 'Social',
    'friends': 'Social',
    'party': 'Social'
  };

  const lowerCategory = invalidCategory.toLowerCase();
  return categoryMap[lowerCategory] || 'Personal'; // Default to Personal if no match
};

// Update task
const updateTask = async (req, res) => {
  try {
    // Validate category if being updated
    if (req.body.category && !ALLOWED_CATEGORIES.includes(req.body.category)) {
      req.body.category = mapToValidCategory(req.body.category);
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// AI Suggestion - Enhanced version with proper category mapping (no priority suggestion)
const aiSuggestTask = async (req, res) => {
  const { taskTitle, taskDescription } = req.body;
  
  if (!taskTitle) return res.status(400).json({ error: "taskTitle is required" });

  const allowedCategoriesStr = ALLOWED_CATEGORIES.join(', ');
  
  const prompt = `Analyze this task and provide comprehensive insights:
  Task Title: ${taskTitle}
  Task Description: ${taskDescription || "No description"}
  
  IMPORTANT: Use only these exact categories: ${allowedCategoriesStr}
  IMPORTANT: Use only these exact difficulties: easy, medium, hard
  NOTE: Do NOT suggest priority - the user will set this themselves
  
  Return strictly in JSON format:
  {
    "suggestion": "Brief helpful suggestion for completing this task",
    "estimatedTime": "30 mins",
    "category": "one of the allowed categories exactly as listed",
    "subtasks": ["subtask 1", "subtask 2"],
    "deadline": "suggested deadline in days from now",
    "difficulty": "easy/medium/hard"
  }`;

  const llm = initGroqClient();

  try {
    const response = await llm.invoke([
      { role: "system", content: "You are an AI productivity assistant. Do not suggest priority levels as users will set these themselves." },
      { role: "user", content: prompt },
    ]);

    const content = response.content.trim();
    const jsonMatch = content.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("No valid JSON found in AI response");

    const aiResult = JSON.parse(jsonMatch[0].replace(/[""]/g, '"'));
    
    // Double-check and fix category if needed
    if (!ALLOWED_CATEGORIES.includes(aiResult.category)) {
      aiResult.category = mapToValidCategory(aiResult.category);
    }

    // Validate difficulty field
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(aiResult.difficulty)) {
      aiResult.difficulty = 'medium';
    }

    // Remove priority from AI response if it exists
    delete aiResult.priority;

    res.json(aiResult);
  } catch (error) {
    console.error("AI Error:", error);
    // Return fallback suggestion without priority
    res.json({
      suggestion: "Focus on breaking this task into smaller, manageable steps.",
      estimatedTime: "30 mins",
      category: "Personal",
      subtasks: ["Plan the approach", "Execute the task", "Review completion"],
      deadline: "3 days",
      difficulty: "medium"
    });
  }
};

// Smart Task Categorization - Updated to use valid categories
const categorizeTask = async (req, res) => {
  const { taskTitle, taskDescription } = req.body;
  
  if (!taskTitle) return res.status(400).json({ error: "taskTitle is required" });

  const allowedCategoriesStr = ALLOWED_CATEGORIES.join(', ');

  const prompt = `Categorize this task into one of these EXACT categories: ${allowedCategoriesStr}
  
  Task: ${taskTitle}
  Description: ${taskDescription || ""}
  
  Return only the category name exactly as listed above.`;

  const llm = initGroqClient();

  try {
    const response = await llm.invoke([
      { role: "system", content: "You are a task categorization expert. Use only the exact category names provided." },
      { role: "user", content: prompt },
    ]);

    let category = response.content.trim();
    
    // Validate and fix category if needed
    if (!ALLOWED_CATEGORIES.includes(category)) {
      category = mapToValidCategory(category);
    }

    res.json({ category });
  } catch (error) {
    console.error("Categorization Error:", error);
    res.json({ category: "Personal" }); // Safe fallback
  }
};

// Generate Daily Schedule
const generateDailySchedule = async (req, res) => {
  try {
    const tasks = await Task.find({ completed: { $ne: true } }).sort({ priority: -1 });
    
    if (tasks.length === 0) {
      return res.json({
        schedule: [],
        summary: "No pending tasks found. Great job staying on top of your work!"
      });
    }

    const taskList = tasks.map(task => 
      `${task.title} (Priority: ${task.priority || 'medium'}, Est: ${task.estimatedTime || 'unknown'})`
    ).join('\n');

    const prompt = `Create an optimized daily schedule for these tasks:
    
    ${taskList}
    
    Consider:
    - Task priorities
    - Estimated time
    - Typical work hours (9 AM - 6 PM)
    - Break times
    - Energy levels throughout the day
    
    Return as JSON:
    {
      "schedule": [
        {
          "time": "9:00 AM",
          "task": "Task name",
          "duration": "30 mins",
          "reason": "Why this time slot"
        }
      ],
      "summary": "Overall scheduling strategy"
    }`;

    const llm = initGroqClient();
    const response = await llm.invoke([
      { role: "system", content: "You are a productivity scheduling expert." },
      { role: "user", content: prompt },
    ]);

    const content = response.content.trim();
    const jsonMatch = content.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("No valid JSON found in AI response");

    const schedule = JSON.parse(jsonMatch[0]);
    res.json(schedule);
  } catch (error) {
    console.error("Schedule Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Smart Task Completion Insights
const getProductivityInsights = async (req, res) => {
  try {
    const completedTasks = await Task.find({ completed: true });
    const pendingTasks = await Task.find({ completed: { $ne: true } });
    
    const completedCount = completedTasks.length;
    const pendingCount = pendingTasks.length;
    const totalTasks = completedCount + pendingCount;
    
    const insights = {
      completionRate: totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0,
      totalCompleted: completedCount,
      totalPending: pendingCount,
      productivity: completedCount > pendingCount ? "High" : completedCount === pendingCount ? "Moderate" : "Low"
    };

    // Get AI analysis
    const prompt = `Analyze this productivity data and provide insights:
    
    Completed Tasks: ${completedCount}
    Pending Tasks: ${pendingCount}
    Completion Rate: ${insights.completionRate}%
    
    IMPORTANT: Return ONLY valid JSON with no extra text. Use this exact structure:
    {
      "analysis": "Brief analysis of current productivity level",
      "advice": "Specific actionable advice to improve productivity", 
      "motivation": "Encouraging and motivational message"
    }`;

    const llm = initGroqClient();
    const response = await llm.invoke([
      { role: "system", content: "You are a productivity coach. Return only valid JSON with proper double quotes around all strings." },
      { role: "user", content: prompt },
    ]);

    const content = response.content.trim();
    let cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const jsonMatch = cleanedContent.match(/{[\s\S]*}/);
    
    if (jsonMatch) {
      try {
        let jsonStr = jsonMatch[0];
        // Fix common JSON issues
        jsonStr = jsonStr
          .replace(/'/g, '"')
          .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
        
        const aiInsights = JSON.parse(jsonStr);
        
        // Validate structure
        insights.aiAnalysis = {
          analysis: aiInsights.analysis || "Your current productivity shows room for improvement.",
          advice: aiInsights.advice || "Try breaking large tasks into smaller, manageable chunks.",
          motivation: aiInsights.motivation || "Every completed task is progress toward your goals!"
        };
      } catch (parseError) {
        console.error("Insights JSON Parse Error:", parseError);
        insights.aiAnalysis = {
          analysis: `With ${insights.completionRate}% completion rate, you're making progress on your tasks.`,
          advice: "Focus on completing high-priority tasks first and break large tasks into smaller steps.",
          motivation: "Keep up the great work! Every task completed brings you closer to your goals."
        };
      }
    } else {
      insights.aiAnalysis = {
        analysis: `Your current completion rate is ${insights.completionRate}%.`,
        advice: "Consider prioritizing your most important tasks and setting realistic daily goals.",
        motivation: "Stay focused and keep moving forward - you've got this!"
      };
    }

    res.json(insights);
  } catch (error) {
    console.error("Insights Error:", error);
    
    // Return basic insights without AI analysis
    const completedTasks = await Task.find({ completed: true });
    const pendingTasks = await Task.find({ completed: { $ne: true } });
    
    res.json({
      completionRate: 0,
      totalCompleted: completedTasks.length,
      totalPending: pendingTasks.length,
      productivity: "Moderate",
      aiAnalysis: {
        analysis: "Unable to generate detailed analysis at the moment.",
        advice: "Focus on completing one task at a time.",
        motivation: "Keep going - progress is progress!"
      }
    });
  }
};

// AI-Powered Task Search and Recommendations
const searchTasks = async (req, res) => {
  const { query } = req.body;
  
  if (!query) return res.status(400).json({ error: "Search query is required" });

  try {
    const allTasks = await Task.find();
    
    if (allTasks.length === 0) {
      return res.json({
        tasks: [],
        suggestions: ["Add some tasks first to enable smart search functionality"]
      });
    }

    const prompt = `Based on this search query: "${query}"
    
    Find relevant tasks from this list:
    ${allTasks.map(task => `${task.title}: ${task.description || ''}`).join('\n')}
    
    Return matching task titles as JSON array:
    {
      "matches": ["task title 1", "task title 2"],
      "suggestions": ["suggestion 1", "suggestion 2"]
    }`;

    const llm = initGroqClient();
    const response = await llm.invoke([
      { role: "system", content: "You are a smart search assistant." },
      { role: "user", content: prompt },
    ]);

    const content = response.content.trim();
    const jsonMatch = content.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("No valid JSON found in AI response");

    const searchResults = JSON.parse(jsonMatch[0]);
    
    // Filter actual tasks based on AI matches
    const matchedTasks = allTasks.filter(task => 
      searchResults.matches.some(match => 
        task.title.toLowerCase().includes(match.toLowerCase()) ||
        match.toLowerCase().includes(task.title.toLowerCase())
      )
    );

    res.json({
      tasks: matchedTasks,
      suggestions: searchResults.suggestions || []
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
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
};