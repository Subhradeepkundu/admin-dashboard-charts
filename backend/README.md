Dashboard App - React, Redux Toolkit, Express

Overview
This is a full-stack application designed to display inventory data in a dashboard. The app includes multiple components for displaying recent data, inventory count categorized by vehicle type, and history logs. Users can filter data by vehicle make, and different durations, and view both summary and detailed data on vehicle inventory.

The app is built using React, Redux Toolkit, and Express. The data is served via an API endpoint built with Express, and the frontend is built using React along with Redux Toolkit for state management.

Features
Dashboard Component:

Displays Recent Data for the most recently gathered inventory.
Inventory Count categorized by:
NEW vehicles
USED vehicles
CPO (Certified Pre-Owned) vehicles
Average MSRP (in USD) for each vehicle category (NEW, USED, CPO).
History Log showing all inventory data including counts, total MSRP, and average MSRP for each vehicle category.
Filters:

Allows the user to filter the displayed data by:
Vehicle Make (if applicable)
Duration:
Last month
This month
Last 3 months
Last 6 months
This year
Last year
API:

The Express API serves data from the provided sample-data.csv file and allows filtering based on the selected parameters (vehicle make and duration).
The API endpoint is /api/inventory, and it responds with the filtered data based on the query parameters.
Data:

The data is sourced from sample-data.csv (a file containing inventory data).
The app uses this data to populate both the frontend (Dashboard) and backend (API).
Technology Stack
Frontend:

React
Redux Toolkit
Axios (for making HTTP requests)
React Router (for navigation, if applicable)
Material-UI (or other UI libraries for components)
Backend:

Express
Node.js
State Management:

Redux Toolkit for managing application state, especially for inventory data and filters.

How to Run the Project
Prerequisites
Make sure you have the following installed:

Node.js (>= 14.x)
npm or yarn
Steps to Run the Application
Clone the repository to your local machine:

git clone https://github.com/your-username/dashboard-app.git
cd dashboard-app
Install backend dependencies:

cd backend
npm install
Install frontend dependencies:

cd frontend
npm install
Start the backend server:

cd backend
npm start

Start the frontend:

cd frontend
npm start
Open your browser and navigate to http://localhost:3000 to view the dashboard.

Time Spent
Total time taken: 7 hours 45 minutes
Notes
The backend is built using Express, serving the data from sample-data.csv via the /api/inventory endpoint.
The frontend is built with React and Redux Toolkit to manage the application state and filter inventory data based on user input.
Material-UI or another UI library was used for creating the dashboard components.
Documentation is provided for setting up and using the project.