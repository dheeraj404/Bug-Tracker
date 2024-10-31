import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for show/hide

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(credentials.username, credentials.password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Login failed. Please check your username and password.');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="page-container">
      <div className="login-box">
        <h2>Task Tracker Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </label>
          <label htmlFor="password" className="password-label">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your password"
              aria-label="Password"
            />
            <span className="password-toggle" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>
          <button type="submit" className="login-button">
            Login
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
