// components/TabNavigation.js
import React from 'react';

const TabButton = ({ id, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-500 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    {label}
  </button>
);

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="mb-6 flex space-x-2 border-b">
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          id={tab.id}
          label={tab.label}
          active={activeTab === tab.id}
          onClick={onTabChange}
        />
      ))}
    </div>
  );
};

export default TabNavigation;