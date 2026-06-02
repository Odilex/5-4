import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Suppliers from './components/Suppliers';
import Shipments from './components/Shipments';
import Deliveries from './components/Deliveries';
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
                <Route path="/" element={<Suppliers />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/shipments" element={<Shipments />} />
                <Route path="/deliveries" element={<Deliveries />} />
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
