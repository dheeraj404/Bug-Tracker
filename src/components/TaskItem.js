// src/components/TaskItem.js
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { TasksContext } from "../contexts/TasksContext";
import EditTaskModal from "./EditTaskModal";
import TaskDetailModal from "./TaskDetailModal"; // Import the new modal
import "./TaskItem.css"; // Import the CSS file
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const TaskItem = ({ task }) => {
  const { authState } = useContext(AuthContext);
  const { deleteTask } = useContext(TasksContext);
  const { user } = authState;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // State for detail modal
  const [assigneeName, setAssigneeName] = useState("");

  useEffect(() => {
    const fetchAssignee = async () => {
      try {
        const response = await axios.get("/users.json");
        const assigneeId = Number(task.assignee);
        const assignee = response.data.find((u) => u.id === assigneeId);
        setAssigneeName(assignee ? assignee.username : "Unknown User");
      } catch (err) {
        console.error("Error fetching assignee:", err);
        setAssigneeName("Unknown User");
      }
    };

    fetchAssignee();
  }, [task.assignee]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
      toast.info("Task deleted successfully.");
    }
  };

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);
  const openDetailModal = () => setIsDetailModalOpen(true);
  const closeDetailModal = () => setIsDetailModalOpen(false);

  return (
    <div className="task-item-container">
      {/* Summary Row */}
      <div className="summary-row" onClick={openDetailModal}>
        <div className="summary-cell">{task.title}</div>
        <div className="summary-cell">{task.status}</div>
        <div className="summary-cell">{task.priority}</div>
      </div>

      {/* Admin Controls (if applicable) */}
      {user.role === "admin" && (
        <div className="admin-controls">
          <button onClick={openEditModal} className="edit-button">Edit</button>
          <button onClick={handleDelete} className="delete-button">Delete</button>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <TaskDetailModal
          task={{ ...task, assigneeName }}
          onClose={closeDetailModal}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditTaskModal task={task} onClose={closeEditModal} />
      )}
    </div>
  );
};

// Define PropTypes
TaskItem.propTypes = {
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
};

export default TaskItem;
