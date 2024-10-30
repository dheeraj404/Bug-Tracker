// src/components/TaskList.js
import React from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';

const TaskList = ({ tasks }) => {
  if (tasks.length === 0) {
    return <p>No tasks to display.</p>;
  }

  return (
    <div style={styles.container}>
      {/* Header Row */}
      <div style={styles.headerRow}>
        <div style={styles.headerCell}>Title</div>
        <div style={styles.headerCell}>Status</div>
        <div style={styles.headerCell}>Priority</div>
        {/* Admins can see controls here */}
        {/* Optionally, you can add a header for actions if needed */}
      </div>
      {/* Task Items */}
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      // ... other task prop types
    })
  ).isRequired,
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: '0 auto',
  },
  headerRow: {
    display: 'flex',
    padding: '0.75rem 1rem',
    backgroundColor: '#343a40',
    color: '#fff',
    fontWeight: 'bold',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  headerCell: {
    flex: 1,
    textAlign: 'left',
  },
};

export default TaskList;
