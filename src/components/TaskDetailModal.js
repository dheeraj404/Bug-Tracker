
import React, { useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TasksContext } from '../contexts/TasksContext';
import { AuthContext } from '../contexts/AuthContext';
import './TaskDetailModal.css';
import { formatDisplayDate } from '../utils/formatTime';
import { toast } from 'react-toastify';
import { FaTimes, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const TaskDetailModal = ({ task, onClose }) => {
  const { updateTask } = useContext(TasksContext);
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const canModify = user.role === 'admin' || user.id === task.assignee;

  const handleSubtaskToggle = (subtaskId) => {
    if (!canModify) return;

    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, isCompleted: !subtask.isCompleted }
        : subtask
    );

    const completedSubtasks = updatedSubtasks.filter((s) => s.isCompleted).length;
    const totalSubtasks = updatedSubtasks.length;
    const completionPercentage =
      totalSubtasks > 0
        ? Math.round((completedSubtasks / totalSubtasks) * 100)
        : 0;

    const updatedTask = {
      ...task,
      subtasks: updatedSubtasks,
      completionPercentage,
      importantDates: {
        ...task.importantDates,
        completedAt:
          completionPercentage === 100
            ? new Date().toISOString()
            : task.importantDates.completedAt,
      },
    };

    updateTask(updatedTask);
    toast.success('Subtask status updated!', {
      className: 'custom-toast-success',
    });
    
  };

  const calcTimeSpent = (date1) => {
    const currentDate = new Date();
    const startDate = new Date(date1);
    const diffInMs = currentDate - startDate;
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Close modal on Esc key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Ref for the modal content to manage focus
  const modalRef = useRef(null);

  // Focus the modal when it opens
  useEffect(() => {
    modalRef.current.focus();
  }, []);

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
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
        <h2 id="modal-title" className="modal-title">Task Details</h2>
        <div className="task-details">
          <div className="detail-row">
            <span className="detail-label">Title:</span>
            <span className="detail-value">{task.title}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{task.description || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Priority:</span>
            <span className={`detail-value priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className={`detail-value status-${task.status.toLowerCase()}`}>
              {task.status}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Assignee:</span>
            <span className="detail-value">{task.assigneeName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Due Date:</span>
            <span className="detail-value">
              {formatDisplayDate(task.importantDates?.dueDate)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time Spent:</span>
            <span className="detail-value">
              {calcTimeSpent(task.importantDates?.createdAt)} (hh:mm)
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Completion:</span>
            <span className="detail-value">{task.completionPercentage}%</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Created At:</span>
            <span className="detail-value">
              {formatDisplayDate(task.importantDates?.createdAt)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Completed At:</span>
            <span className="detail-value">
              {task.importantDates?.completedAt
                ? formatDisplayDate(task.importantDates.completedAt)
                : 'N/A'}
            </span>
          </div>

          {/* Subtasks */}
          <div className="subtasks-section">
            <h3>Subtasks</h3>
            {task.subtasks && task.subtasks.length > 0 ? (
              <ul className="subtasks-list">
                {task.subtasks.map((subtask, index) => (
                  <li key={subtask.id} className="subtask-item">
                    <button
                      className="subtask-toggle"
                      onClick={() => handleSubtaskToggle(subtask.id)}
                      disabled={!canModify}
                      aria-pressed={subtask.isCompleted}
                      aria-label={`Mark subtask "${subtask.title}" as ${
                        subtask.isCompleted ? 'incomplete' : 'complete'
                      }`}
                    >
                      {subtask.isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                    </button>
                    <span
                      className={`subtask-title ${
                        subtask.isCompleted ? 'completed' : ''
                      }`}
                    >
                      {index + 1}. {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No subtasks available.</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

TaskDetailModal.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
    assigneeName: PropTypes.string,
    importantDates: PropTypes.shape({
      createdAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
      dueDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
      completedAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    }),
    completionPercentage: PropTypes.number,
    subtasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        isCompleted: PropTypes.bool,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TaskDetailModal;
