// components/ProductivityInsights.js
import React, { useState } from 'react';
import * as taskService from '../services/taskService';

const StatCard = ({ value, label, bgColor, textColor }) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
    <div className={`text-sm ${textColor.replace('600', '800')}`}>{label}</div>
  </div>
);

const InsightCard = ({ title, content, bgColor, titleColor }) => (
  <div className={`p-4 ${bgColor} rounded-lg`}>
    <h3 className={`font-semibold ${titleColor} mb-2`}>{title}</h3>
    <p className={titleColor.replace('800', '700')}>{content}</p>
  </div>
);

const ProductivityInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetInsights = async () => {
    setLoading(true);
    try {
      const insightsData = await taskService.getProductivityInsights();
      setInsights(insightsData);
    } catch (error) {
      console.error("Error getting insights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Productivity Insights</h2>
        <button
          onClick={handleGetInsights}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
        >
          {loading ? "Analyzing..." : "📊 Get Insights"}
        </button>
      </div>
      
      {insights && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              value={`${insights.completionRate}%`}
              label="Completion Rate"
              bgColor="bg-blue-50"
              textColor="text-blue-600"
            />
            <StatCard
              value={insights.totalCompleted}
              label="Completed"
              bgColor="bg-green-50"
              textColor="text-green-600"
            />
            <StatCard
              value={insights.totalPending}
              label="Pending"
              bgColor="bg-yellow-50"
              textColor="text-yellow-600"
            />
            <StatCard
              value={insights.productivity}
              label="Productivity"
              bgColor="bg-purple-50"
              textColor="text-purple-600"
            />
          </div>

          {/* AI Analysis */}
          {insights.aiAnalysis && (
            <div className="space-y-4">
              <InsightCard
                title="Analysis"
                content={insights.aiAnalysis.analysis}
                bgColor="bg-blue-50"
                titleColor="text-blue-800"
              />
              
              <InsightCard
                title="Advice"
                content={insights.aiAnalysis.advice}
                bgColor="bg-green-50"
                titleColor="text-green-800"
              />
              
              <InsightCard
                title="Motivation"
                content={insights.aiAnalysis.motivation}
                bgColor="bg-purple-50"
                titleColor="text-purple-800"
              />
            </div>
          )}
        </div>
      )}
      
      {!insights && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">📊 Want to see how you're doing?</p>
          <p>Click "Get Insights" to analyze your productivity patterns and get personalized advice.</p>
        </div>
      )}
    </div>
  );
};

export default ProductivityInsights;