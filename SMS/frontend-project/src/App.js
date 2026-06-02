import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Products from './components/Products';
import Warehouses from './components/Warehouses';
import Transactions from './components/Transactions';
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
                <Route path="/" element={<Products />} />
                <Route path="/products" element={<Products />} />
                <Route path="/warehouses" element={<Warehouses />} />
                <Route path="/transactions" element={<Transactions />} />
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
