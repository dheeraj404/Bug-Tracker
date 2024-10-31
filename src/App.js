
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { TasksProvider } from './contexts/TasksContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
  const { authState } = React.useContext(AuthContext);
  return authState.isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <TasksProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            {/* Add more routes as needed */}
          </Routes>
        </TasksProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
