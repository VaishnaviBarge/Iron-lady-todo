// components/DailySchedule.js
import React, { useState } from 'react';
import * as taskService from '../services/taskService';

const DailySchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateSchedule = async () => {
    setLoading(true);
    try {
      const scheduleData = await taskService.generateDailySchedule();
      setSchedule(scheduleData);
    } catch (error) {
      console.error("Error generating schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">AI-Generated Daily Schedule</h2>
        <button
          onClick={handleGenerateSchedule}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
        >
          {loading ? "Generating..." : "📅 Generate Schedule"}
        </button>
      </div>
      
      {schedule && (
        <div>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Strategy:</h3>
            <p className="text-blue-700">{schedule.summary}</p>
          </div>
          
          {schedule.schedule && schedule.schedule.length > 0 ? (
            <div className="space-y-3">
              {schedule.schedule.map((item, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-20 font-semibold text-blue-600">{item.time}</div>
                  <div className="flex-1 ml-4">
                    <div className="font-medium">{item.task}</div>
                    <div className="text-sm text-gray-600">{item.reason}</div>
                  </div>
                  <div className="text-sm text-gray-500">{item.duration}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No schedule items available. Make sure you have pending tasks.
            </p>
          )}
        </div>
      )}
      
      {!schedule && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">📅 Ready to optimize your day?</p>
          <p>Click "Generate Schedule" to create an AI-powered daily plan based on your tasks.</p>
        </div>
      )}
    </div>
  );
};

export default DailySchedule;