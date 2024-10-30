import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { TasksContext } from '../contexts/TasksContext';
import TaskList from '../components/TaskList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressGraph from  '../components/ProgressGraph';
import UserProgressGraph from '../components/UserProgressGraph';
import TaskForm from  '../components/TaskForm';
const DashboardPage = () => {
  const { authState, logout } = useContext(AuthContext);
  const { tasks, loading } = useContext(TasksContext);
  const { user } = authState;

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState('All');
  const [filterOption, setFilterOption] = useState('All');

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully!');
  };

  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setSortDropdownOpen(false);
  };

  const handleFilterOptionChange = (option) => {
    setFilterOption(option);
    setFilterDropdownOpen(false);
  };

  // Filter and sorting logic for tasks
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const filteredTasks =
    user.role === 'admin'
      ? safeTasks
      : safeTasks.filter((task) => task.assignee === user.id);

  const sortedAndFilteredTasks = filteredTasks.filter((task) => {
    const priorityMatch = sortOption === 'All' || task.priority === sortOption;
    const statusMatch = filterOption === 'All' || task.status === filterOption;
    return priorityMatch && statusMatch;
  });

  return (
    <div style={styles.container}>
      <ToastContainer />
      <header style={styles.header}>
        <h2 style={{marginTop:'2rem',fontSize:'2rem'}}>Task Tracker Dashboard</h2>
        <div>
          <span>
            Welcome, {user.username} ({user.role})
          </span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>
      {user.role === 'admin' && (
        <div style={styles.adminSection}>
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            style={styles.createButton}
          >
            {showTaskForm ? 'Close Form' : 'Create New Task'}
          </button>
          {showTaskForm && <TaskForm />}
        </div>
      )}


      <div style={styles.sortContainer}>
        {/* Sort by Priority */}
        <div style={styles.dropdownContainer}>
          <button
            style={styles.dropdownButton}
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            Sort by: {sortOption}
          </button>
          {sortDropdownOpen && (
            <div style={styles.glassDropdownMenu}>
              {['All', 'High', 'Medium', 'Low'].map((option) => (
                <div
                  key={option}
                  style={styles.dropdownItem}
                  onClick={() => handleSortOptionChange(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter by Status */}
        <div style={styles.dropdownContainer}>
          <button
            style={styles.dropdownButton}
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
          >
            Filter by: {filterOption}
          </button>
          {filterDropdownOpen && (
            <div style={styles.glassDropdownMenu}>
              {['All', 'Open', 'In Progress', 'Closed'].map((option) => (
                <div
                  key={option}
                  style={styles.dropdownItem}
                  onClick={() => handleFilterOptionChange(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <h3 style={{marginTop:'1rem',fontSize:'1.5rem'}}>Open Tasks </h3>
          <TaskList tasks={sortedAndFilteredTasks.filter((task) => task.status !== 'Closed')} />

          <h3 style={{marginTop:'2rem',fontSize:'1.5rem'}}>Completed Tasks</h3>
          <TaskList tasks={sortedAndFilteredTasks.filter((task) => task.status === 'Closed')} />
        </>
      )}
        {user.role === 'admin' && (
        <div style={styles.graphContainer}>
          <h3>Overall Progress Graph</h3>
          <ProgressGraph tasks={safeTasks} />
        </div>
      )}

      {user.role === 'user' && (
        <div style={styles.graphContainer}>
          <h3>Your Progress Graph</h3>
          <UserProgressGraph tasks={safeTasks} userId={user.id} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '1rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  createButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    fontSize: '1rem',
    transition: 'background 0.3s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  logoutButton: {
    marginLeft: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  sortContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  dropdownContainer: {
    position: 'relative',
    marginTop:'2rem'
  },
  dropdownButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    fontSize: '1rem',
    transition: 'background 0.3s',

  },
  glassDropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: '0.5rem 1rem',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontSize: '0.9rem',
  },
};

export default DashboardPage;
