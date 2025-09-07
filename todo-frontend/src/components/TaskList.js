// components/TaskList.js
import React from 'react';
import TaskItem from './TaskItem.js';

const TaskList = ({ tasks, onDeleteTask, onToggleComplete, onUpdateTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">No tasks yet. Add your first task above! 🎯</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={() => onDeleteTask(task._id)}
          onToggleComplete={() => onToggleComplete(task._id, task.completed)}
          onUpdate={onUpdateTask}
        />
      ))}
    </div>
  );
};

export default TaskList;