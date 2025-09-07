// components/TaskManager.js
import React from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const TaskManager = ({ 
  tasks, 
  onAddTask, 
  onDeleteTask, 
  onUpdateTask,
  onToggleComplete, 
  loading 
}) => {
  return (
    <div>
      <TaskForm 
        onAddTask={onAddTask} 
        loading={loading} 
      />
      
      <TaskList
        tasks={tasks}
        onDeleteTask={onDeleteTask}
        onToggleComplete={onToggleComplete}
        onUpdateTask={onUpdateTask}
      />
    </div>
  );
};

export default TaskManager;