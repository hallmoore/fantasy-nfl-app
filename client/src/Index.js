import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Imports global styles for your entire app
import App from './App'; // Imports the main App component

// 1. Find the HTML element with the id 'root' in the public/index.html file.
const rootElement = document.getElementById('root');

// 2. Create a React "root" which is the starting point for rendering.
const root = ReactDOM.createRoot(rootElement);

// 3. Render the main <App /> component inside the React root.
//    <React.StrictMode> is a helper component that checks for potential
//    problems in your app during development. It doesn't run in production.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
