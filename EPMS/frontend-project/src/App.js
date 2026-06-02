import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Employees from './components/Employees';
import Departments from './components/Departments';
import Salaries from './components/Salaries';
import Reports from './components/Reports';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route
          path="/*"
          element={
            <Layout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
              <Routes>
                <Route path="/" element={<Employees />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/salaries" element={<Salaries />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
