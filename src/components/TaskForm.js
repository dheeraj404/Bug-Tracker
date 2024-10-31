// src/components/TaskForm.js
import React, { useState, useContext, useEffect } from 'react';
import { TasksContext } from '../contexts/TasksContext';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import './TaskForm.css'; // Ensure this CSS file exists or adjust styles accordingly
import { FaPlus, FaTimes } from 'react-icons/fa';

const TaskForm = () => {
  const { addTask } = useContext(TasksContext);
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const [users, setUsers] = useState([]);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'Open',
    assignee: '',
    importantDates: { dueDate: '' },
    subtasks: [{ id: 1, title: '', isCompleted: false }],
    completionPercentage: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users.json');
        const normalUsers = response.data.filter((u) => u.role === 'user');
        setUsers(normalUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        toast.error('Failed to load users.');
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setTaskData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setTaskData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubtaskChange = (id, value) => {
    const updatedSubtasks = taskData.subtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, title: value } : subtask
    );
    setTaskData((prev) => ({ ...prev, subtasks: updatedSubtasks }));
  };

  const addSubtask = () => {
    const newId =
      taskData.subtasks.length > 0
        ? taskData.subtasks[taskData.subtasks.length - 1].id + 1
        : 1;
    setTaskData((prev) => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        { id: newId, title: '', isCompleted: false },
      ],
    }));
  };

  const removeSubtask = (id) => {
    const updatedSubtasks = taskData.subtasks.filter(
      (subtask) => subtask.id !== id
    );
    setTaskData((prev) => ({ ...prev, subtasks: updatedSubtasks }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.assignee) {
      toast.error('Please select an assignee.');
      return;
    }

    // Ensure all subtask titles are filled and at least one subtask exists
    const hasValidSubtasks = taskData.subtasks.some((subtask) => subtask.title.trim());
    if (!hasValidSubtasks) {
      toast.error('Please add at least one subtask with a title.');
      return;
    }

    const completedSubtasks = taskData.subtasks.filter(
      (s) => s.isCompleted
    ).length;
    const totalSubtasks = taskData.subtasks.length;
    const completionPercentage = totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

    const newTask = {
      ...taskData,
      id: Date.now(),
      createdBy: user.id,
      timeSpent: 0,
      importantDates: {
        ...taskData.importantDates,
        createdAt: new Date().toISOString(),
      },
      completionPercentage,
      assignee: Number(taskData.assignee),
    };

    addTask(newTask);
    toast.success('Task created successfully!');
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      status: 'Open',
      assignee: '',
      importantDates: { dueDate: '' },
      subtasks: [{ id: 1, title: '', isCompleted: false }],
      completionPercentage: 0,
    });
  };

  // Get today's date in the format YYYY-MM-DD for setting as the min value for due date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="task-form-container">
      <h3>Create New Task</h3>
      <form onSubmit={handleSubmit} className="task-form">
        <label className="form-label">
          Title:
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter task title"
          />
        </label>
        <label className="form-label">
          Description:
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Enter task description"
          />
        </label>
        <label className="form-label">
          Priority:
          <select
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            className="form-select"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label className="form-label">
          Status:
          <select
            name="status"
            value={taskData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>
        </label>
        <label className="form-label">
          Assignee:
          <select
            name="assignee"
            value={taskData.assignee}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Due Date:
          <input
            type="date"
            name="importantDates.dueDate"
            value={taskData.importantDates.dueDate}
            onChange={handleChange}
            className="form-input"
            min={today}
          />
        </label>

        {/* Subtasks */}
        <div className="subtasks-container">
          <h4>Subtasks</h4>
          {taskData.subtasks.map((subtask, index) => (
            <div key={subtask.id} className="subtask">
              <input
                type="text"
                placeholder={`Subtask ${index + 1}`}
                value={subtask.title}
                onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                required
                className="subtask-input"
              />
              {taskData.subtasks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubtask(subtask.id)}
                  className="remove-button"
                  aria-label={`Remove Subtask ${index + 1}`}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSubtask}
            className="add-button"
            aria-label="Add Subtask"
          >
            <FaPlus /> Add Subtask
          </button>
        </div>

        <button type="submit" className="submit-button">
          Create Task
        </button>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default TaskForm;
