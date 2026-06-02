import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Customers from './components/Customers';
import Products from './components/Products';
import Sales from './components/Sales';
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
                <Route path="/" element={<Customers />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/products" element={<Products />} />
                <Route path="/sales" element={<Sales />} />
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
