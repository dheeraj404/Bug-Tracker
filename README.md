# Task/Bug Tracker Web Application

This project is a web application for tracking tasks and bugs, designed with a user-friendly interface and responsive design. The application provides functionalities for both **Admins** and **Users**. Admins can create, assign, and manage tasks, while users can view and update their assigned tasks, track subtasks, and view completion progress.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Assumptions Made](#assumptions-made)
- [Project Highlights](#project-highlights)
- [License](#license)

## Features

- **User Authentication**: Simple mock login system with role-based access (Admin/User).
- **Dashboard**:
  - Admins can view, create, edit, delete, and assign tasks to users.
  - Users can view their assigned tasks.
- **Task Management**:
  - Admins can create tasks with fields like title, description, priority, status, due date, etc.
  - Each task can contain multiple subtasks.
  - Users can mark subtasks as completed.
- **Task Completion Verification**:
  - After a user completes all subtasks for a task, they can mark the task as "Ready for Review."
  - Admins will review completed tasks. If the task is verified as complete, the admin can mark the task status as "Completed."
  - Once marked as "Completed," the task will appear as completed for both the admin and the user.
- **Progress Tracking**:
  - Real-time progress bar that updates as subtasks are completed.
  - A time tracker that shows how much time is spent on each task.
- **Responsive UI**: Works seamlessly across devices with a clean and intuitive design.

## Technology Stack

- **Frontend**: Next.js (React.js)
- **State Management**: Context API
- **Styling**: CSS with Glassmorphism effects for modern UI design
- **Storage**: Local storage for task persistence across sessions
- **Mock Data**: JSON files to simulate database data for users and tasks

## Project Structure


## Getting Started

### Prerequisites

- **Node.js**: Make sure Node.js is installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Installed with Node.js. You can also use `yarn` as an alternative package manager.

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/task-bug-tracker.git
   cd task-bug-tracker
2.Install Dependencies:
`npm install`

3.Create Mock Data Files:

Ensure the following files exist in the public directory for mock data:

public/users.json: Contains user data with roles (admin, user).
public/tasks.json: Contains initial task data.
4.Start the Development Server:
`npm run dev`

##Usage

###Login:
Use admin credentials for admin functionalities.
Use user credentials to see the user dashboard.
Mock data for login credentials is stored in users.json.

###Dashboard:
Admins can view and manage all tasks, create new tasks, and assign them to users.
Users can only view their assigned tasks and mark subtasks as completed.

###Task Management:
Admins can create tasks with additional details like priority and due dates.
Users can view and update subtasks, and track their completion progress.

###Task Completion Workflow:
After completing all subtasks for a task, users mark the task as "Ready for Review."
Admins review these tasks. If verified, they update the task status to "Completed."
Once marked "Completed," tasks are visible as completed for both the admin and the user.

##Assumptions Made
Authentication: This project uses mock authentication with hardcoded credentials in users.json. There is no real authentication system; it’s only for demonstration.
Local Storage Persistence: Tasks are stored in local storage to maintain data across page reloads. This is a temporary data storage approach.
Date Format: All dates are stored and displayed in YYYY-MM-DD format for simplicity.
Static Data Source: users.json and tasks.json simulate backend data, with tasks initially loaded from tasks.json if no tasks exist in local storage.

##Project Highlights
Context API for State Management: The app uses Context API for managing authentication and tasks, avoiding the need for external state management libraries.
Responsive Design: The interface is responsive and provides an intuitive experience on both mobile and desktop.
Glassmorphism UI: The project features a modern glassmorphism effect for UI elements, adding a visually appealing design layer.
Date Handling: Dates are consistently handled in the TasksContext to ensure compatibility between components. All dates are converted to ISO strings before storage.
Task Progress Tracking: Each task has a progress bar that updates as users complete subtasks, giving a clear visual representation of task completion.
Admin Task Verification: A task completion verification feature allows admins to confirm task completion, adding an extra layer of accountability for task status updates.

##Known Limitations
No Real Authentication: This project does not implement real authentication or authorization, as it is based on mock data.
Local Storage as Database: Tasks are stored in local storage, meaning they are specific to each user's browser and do not sync across users or sessions.
Limited Error Handling: Error handling is minimal and mainly logs errors to the console.
