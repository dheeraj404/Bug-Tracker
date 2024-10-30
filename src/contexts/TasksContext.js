// src/contexts/TasksContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch users from users.json on initial load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users.json');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  // Fetch tasks from localStorage or initialize with an empty array
  useEffect(() => {
    const fetchTasks = async () => {
      let parsedTasks = [];

      const storedTasks = localStorage.getItem('tasks');
      console.log(storedTasks);
      if (Array.isArray(storedTasks) && storedTasks.length > 0) {
        try {
          parsedTasks = JSON.parse(storedTasks);
        } catch (err) {
          console.error('Error parsing tasks from localStorage:', err);
          parsedTasks = [];
        }
      } else {
        try {
          const res = await axios.get('/tasks.json');
          console.log(res);
          parsedTasks = res.data;
        } catch (err) {
          console.error('Error fetching tasks from tasks.json:', err);
          parsedTasks = [];
        }
      }

      if (!parsedTasks || !Array.isArray(parsedTasks)) {
        setTasks([]);
        return;
      }

      try {
        // Enrich tasks with assigneeName and convert date strings to Date objects
        const enrichedTasks = parsedTasks.map((task) => {
          const assignee = users.find((u) => u.id === task.assignee);
          return {
            ...task,
            assigneeName: assignee ? assignee.username : 'Unknown User',
            importantDates: {
              createdAt: task.importantDates?.createdAt
                ? new Date(task.importantDates.createdAt)
                : null,
              dueDate: task.importantDates?.dueDate
                ? new Date(task.importantDates.dueDate)
                : null,
              completedAt: task.importantDates?.completedAt
                ? new Date(task.importantDates.completedAt)
                : null,
            },
          };
        });
        setTasks(enrichedTasks);
      } catch (err) {
        console.error('Error enriching tasks:', err);
        setTasks([]);
      }
    };
        // Only fetch tasks after users have been loaded
        if (users.length > 0) {
          fetchTasks();
        }
      }, [users]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    // Convert Date objects back to ISO strings before storing
    const tasksToStore = tasks.map((task) => ({
      ...task,
      importantDates: {
        createdAt: task.importantDates.createdAt
          ? new Date(task.importantDates.createdAt)
          : null,
        dueDate: task.importantDates.dueDate
          ? new Date(task.importantDates.dueDate)
          : null,
        completedAt: task.importantDates.completedAt
          ? new Date(task.importantDates.completedAt)
          : null,
      },
    }));
    localStorage.setItem('tasks', JSON.stringify(tasksToStore));
  }, [tasks]);

  const addTask = (task) => {
    const assignee = users.find((u) => u.id === task.assignee);
    const enrichedTask = {
      ...task,
      assigneeName: assignee ? assignee.username : 'Unknown User',
    };
    setTasks((prevTasks) => [...prevTasks, enrichedTask]);
  };

  const updateTask = (updatedTask) => {
    const assignee = users.find((u) => u.id === updatedTask.assignee);
    const enrichedTask = {
      ...updatedTask,
      assigneeName: assignee ? assignee.username : 'Unknown User',
    };
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === enrichedTask.id ? enrichedTask : task))
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

TasksProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
