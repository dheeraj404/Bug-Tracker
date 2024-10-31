
import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UserProgressGraph = ({ tasks, userId }) => {
  // Filter tasks assigned to the user
  const userTasks = tasks.filter((task) => task.assignee === userId);

  // Calculate task status counts
  const statusCounts = userTasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const data = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

UserProgressGraph.propTypes = {
  tasks: PropTypes.array.isRequired,
  userId: PropTypes.number.isRequired,
};

export default UserProgressGraph;
