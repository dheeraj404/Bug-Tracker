// src/components/ProgressGraph.js
import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProgressGraph = ({ tasks }) => {
  // Calculate task status counts
  const statusCounts = tasks.reduce(
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
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="80%"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

ProgressGraph.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default ProgressGraph;
