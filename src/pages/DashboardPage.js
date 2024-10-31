// DashboardPage.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { TasksContext } from '../contexts/TasksContext';
import TaskList from '../components/TaskList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressGraph from '../components/ProgressGraph';
import UserProgressGraph from '../components/UserProgressGraph';
import TaskForm from '../components/TaskForm';
import './DashboardPage.css'; // Import the CSS file

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
    <div className="container">
      <ToastContainer />
      <header className="header">
        <h2 className="pro_h">Task Tracker Dashboard</h2>
        <div>
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout} className="logoutButton">
            Logout
          </button>
        </div>
      </header>
      {user.role === 'admin' && (
        <div className="adminSection">
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="createButton"
          >
            {showTaskForm ? 'Close Form' : 'Create New Task'}
          </button>
          {showTaskForm && <TaskForm />}
        </div>
      )}

      <div className="sortContainer">
        {/* Sort by Priority */}
        <div className="dropdownContainer">
          <button
            className="dropdownButton"
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            Sort by: {sortOption}
          </button>
          {sortDropdownOpen && (
            <div className="glassDropdownMenu">
              {['All', 'High', 'Medium', 'Low'].map((option) => (
                <div
                  key={option}
                  className="dropdownItem"
                  onClick={() => handleSortOptionChange(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter by Status */}
        <div className="dropdownContainer">
          <button
            className="dropdownButton"
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
          >
            Filter by: {filterOption}
          </button>
          {filterDropdownOpen && (
            <div className="glassDropdownMenu">
              {['All', 'Open', 'In Progress', 'Closed'].map((option) => (
                <div
                  key={option}
                  className="dropdownItem"
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
          <h3>Open Tasks</h3>
          <TaskList tasks={sortedAndFilteredTasks.filter((task) => task.status !== 'Closed')} />

          <h3>Completed Tasks</h3>
          <TaskList tasks={sortedAndFilteredTasks.filter((task) => task.status === 'Closed')} />
        </>
      )}

      {user.role === 'admin' && (
        <div className="graphContainer">
          <h3 className="pro_h">Overall Progress Graph</h3>
          <ProgressGraph tasks={safeTasks} />
        </div>
      )}

      {user.role === 'user' && (
        <div className="graphContainer">
          <h3>Your Progress Graph</h3>
          <UserProgressGraph tasks={safeTasks} userId={user.id} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
