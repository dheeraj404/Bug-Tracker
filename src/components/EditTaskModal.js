// src/components/EditTaskModal.js
import React, { useState, useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { TasksContext } from '../contexts/TasksContext';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { convertToSeconds } from '../utils/formatTime';
import { FaTimes, FaPlus, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import './EditTaskModal.css'; // Import CSS for styling

const EditTaskModal = ({ task, onClose }) => {
  const { updateTask } = useContext(TasksContext);
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const [users, setUsers] = useState([]);
  const [taskData, setTaskData] = useState({ 
    ...task, 
    timeSpent: formatTime(task.timeSpent) // Initialize as mm:ss
  });

  // Helper function to format time from seconds to mm:ss
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  }

  // Fetch users for assignee options
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
      // Handle nested fields like importantDates.dueDate
      const [parent, child] = name.split('.');
      setTaskData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setTaskData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubtaskChange = (id, value) => {
    const updatedSubtasks = taskData.subtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, title: value } : subtask
    );
    setTaskData((prev) => ({ ...prev, subtasks: updatedSubtasks }));
  };

  const toggleSubtaskCompletion = (subtaskId) => {
    const updatedSubtasks = taskData.subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, isCompleted: !subtask.isCompleted } : subtask
    );

    const completedSubtasks = updatedSubtasks.filter((s) => s.isCompleted).length;
    const totalSubtasks = updatedSubtasks.length;
    const completionPercentage = totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

    setTaskData((prev) => ({
      ...prev,
      subtasks: updatedSubtasks,
      completionPercentage,
      importantDates: {
        ...prev.importantDates,
        completedAt: completionPercentage === 100 ? new Date().toISOString() : prev.importantDates.completedAt,
      },
    }));
  };

  const addSubtask = () => {
    const newId = taskData.subtasks.length > 0
      ? taskData.subtasks[taskData.subtasks.length - 1].id + 1
      : 1;
    setTaskData((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { id: newId, title: '', isCompleted: false }],
    }));
  };

  const removeSubtask = (id) => {
    const updatedSubtasks = taskData.subtasks.filter((subtask) => subtask.id !== id);
    setTaskData((prev) => ({ ...prev, subtasks: updatedSubtasks }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate assignee
    if (!taskData.assignee) {
      toast.error('Please select an assignee.');
      return;
    }

    // Validate timeSpent format mm:ss
    const timePattern = /^\d{1,2}:\d{2}$/;
    if (!timePattern.test(taskData.timeSpent)) {
      toast.error('Please enter Time Spent in mm:ss format.');
      return;
    }

    // Ensure all subtask titles are filled
    for (let subtask of taskData.subtasks) {
      if (!subtask.title.trim()) {
        toast.error('Please fill all subtask titles.');
        return;
      }
    }

    // Convert timeSpent to total seconds
    const totalSeconds = convertToSeconds(taskData.timeSpent);

    // Calculate completion percentage
    const completedSubtasks = taskData.subtasks.filter((s) => s.isCompleted).length;
    const totalSubtasks = taskData.subtasks.length;
    const completionPercentage = totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

    const updatedTask = {
      ...taskData,
      completionPercentage,
      timeSpent: totalSeconds,
      importantDates: {
        ...taskData.importantDates,
        completedAt: completionPercentage === 100 ? new Date().toISOString() : taskData.importantDates.completedAt,
      },
      assignee: Number(taskData.assignee), // Parse as number
    };

    updateTask(updatedTask);
    toast.success('Task updated successfully!');
    onClose();
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Ref for the modal content to manage focus
  const modalRef = useRef(null);

  // Focus the modal when it opens
  useEffect(() => {
    modalRef.current.focus();
  }, []);

  // Modal JSX
  const modalContent = (
    <div
      className="modal-overlay"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="edit-modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1"
        ref={modalRef}
      >
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <FaTimes />
        </button>
        <h2 id="edit-modal-title" className="modal-title">Edit Task</h2>
        <form onSubmit={handleSubmit} className="edit-task-form">
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter task description"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              className="form-select"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={taskData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="assignee">Assignee:</label>
            <select
              id="assignee"
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
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="importantDates.dueDate"
              value={taskData.importantDates.dueDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="timeSpent">Time Spent (mm:ss):</label>
            <input
              type="text"
              id="timeSpent"
              name="timeSpent"
              value={taskData.timeSpent}
              onChange={handleChange}
              placeholder="e.g., 25:30"
              required
              className="form-input"
            />
          </div>

          {/* Subtasks */}
          <div className="subtasks-container">
            <h4 className="subtasks-title">Subtasks</h4>
            {taskData.subtasks.map((subtask, index) => (
              <div key={subtask.id} className="subtask-item">
                <button
                  type="button"
                  onClick={() => toggleSubtaskCompletion(subtask.id)}
                  className="subtask-toggle-button"
                  aria-pressed={subtask.isCompleted}
                  aria-label={`Mark subtask "${subtask.title}" as ${subtask.isCompleted ? 'incomplete' : 'complete'}`}
                >
                  {subtask.isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                </button>
                <input
                  type="text"
                  placeholder={`Subtask ${index + 1}`}
                  value={subtask.title}
                  onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                  required
                  className={`subtask-input ${subtask.isCompleted ? 'completed' : ''}`}
                />
                {taskData.subtasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubtask(subtask.id)}
                    className="remove-subtask-button"
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
              className="add-subtask-button"
              aria-label="Add Subtask"
            >
              <FaPlus /> Add Subtask
            </button>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render modal using React Portal
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById('modal-root') // Ensure this ID matches the one in index.html
  );
};

EditTaskModal.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
    assignee: PropTypes.number,
    createdBy: PropTypes.number,
    timeSpent: PropTypes.number,
    importantDates: PropTypes.shape({
      createdAt: PropTypes.string,
      dueDate: PropTypes.string,
      completedAt: PropTypes.string,
    }),
    subtasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        isCompleted: PropTypes.bool,
      })
    ),
    completionPercentage: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditTaskModal;
