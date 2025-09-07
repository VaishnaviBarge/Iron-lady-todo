// server.js
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
const { ChatGroq } = require("@langchain/groq");

// const app = express();
// const PORT = process.env.PORT || 5000;
const GROQ_API_KEY = process.env.GROQ_API_KEY || "your_groq_api_key_here";


const getAISuggestion = async (req, res) => {
  const { taskTitle, taskDescription } = req.body;
  console.log(req.body);
  
  console.log("taskTitle");
  
  if (!taskTitle) return res.status(400).json({ error: "taskTitle is required" });

  const prompt = `Analyze this task and provide a suggestion with priority.
  Task Title: ${taskTitle}
  Task Description: ${taskDescription || "No description"}
  
  Return strictly in JSON format: { "suggestion": "...", "priority": "high/medium/low" }`;

  const llm = new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
    temperature: 0,
    max_tokens: 5000,
    maxRetries: 5,
  });

  try {
    const response = await llm.invoke([
      { role: "system", content: "You are an AI assistant for analyzing tasks." },
      { role: "user", content: prompt },
    ]);

    const content = response.content.trim();
    console.log("content",content);
    
    const jsonMatch = content.match(/{[\s\S]*}/);
    console.log(jsonMatch);
    
    if (!jsonMatch) throw new Error("No valid JSON found in AI response");

    const aiResult = JSON.parse(jsonMatch[0].replace(/[“”]/g, '"'));
    console.log("aiResult",aiResult);
    console.log("-------------------------");

    
    
    res.json(aiResult);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports={getAISuggestion};