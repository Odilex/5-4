const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'SCMS'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      res.json({ message: 'Login successful', user: results[0] });
    }
  });
});

// Supplier routes - Insert only
app.post('/api/suppliers', (req, res) => {
  const { supplierCode, supplierName, telephone, address, email } = req.body;
  const query = 'INSERT INTO Supplier (supplierCode, supplierName, telephone, address, email) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [supplierCode, supplierName, telephone, address, email], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Supplier created', id: result.insertId });
  });
});

app.get('/api/suppliers', (req, res) => {
  db.query('SELECT * FROM Supplier', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// Shipment routes - Insert, Delete, Update, Retrieve
app.post('/api/shipments', (req, res) => {
  const { shipmentNumber, shipmentDate, shipmentStatus, destination, supplierCode } = req.body;
  const query = 'INSERT INTO Shipment (shipmentNumber, shipmentDate, shipmentStatus, destination, supplierCode) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [shipmentNumber, shipmentDate, shipmentStatus, destination, supplierCode], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Shipment created', id: result.insertId });
  });
});

app.get('/api/shipments', (req, res) => {
  db.query('SELECT * FROM Shipment', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.put('/api/shipments/:id', (req, res) => {
  const { shipmentNumber, shipmentDate, shipmentStatus, destination, supplierCode } = req.body;
  const query = 'UPDATE Shipment SET shipmentNumber = ?, shipmentDate = ?, shipmentStatus = ?, destination = ?, supplierCode = ? WHERE id = ?';
  db.query(query, [shipmentNumber, shipmentDate, shipmentStatus, destination, supplierCode, req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Shipment updated' });
  });
});

app.delete('/api/shipments/:id', (req, res) => {
  db.query('DELETE FROM Shipment WHERE id = ?', [req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Shipment deleted' });
  });
});

// Delivery routes - Insert, Delete, Update, Retrieve
app.post('/api/deliveries', (req, res) => {
  const { deliveryCode, deliveryDate, quantityDelivered, deliveryStatus, shipmentNumber } = req.body;
  const query = 'INSERT INTO Delivery (deliveryCode, deliveryDate, quantityDelivered, deliveryStatus, shipmentNumber) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [deliveryCode, deliveryDate, quantityDelivered, deliveryStatus, shipmentNumber], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Delivery created', id: result.insertId });
  });
});

app.get('/api/deliveries', (req, res) => {
  db.query('SELECT * FROM Delivery', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.put('/api/deliveries/:id', (req, res) => {
  const { deliveryCode, deliveryDate, quantityDelivered, deliveryStatus, shipmentNumber } = req.body;
  const query = 'UPDATE Delivery SET deliveryCode = ?, deliveryDate = ?, quantityDelivered = ?, deliveryStatus = ?, shipmentNumber = ? WHERE id = ?';
  db.query(query, [deliveryCode, deliveryDate, quantityDelivered, deliveryStatus, shipmentNumber, req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Delivery updated' });
  });
});

app.delete('/api/deliveries/:id', (req, res) => {
  db.query('DELETE FROM Delivery WHERE id = ?', [req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Delivery deleted' });
  });
});

// Reports routes
app.get('/api/reports/daily', (req, res) => {
  const query = `
    SELECT 
      DATE(shipmentDate) as date,
      COUNT(*) as totalShipments,
      SUM(CASE WHEN shipmentStatus = 'Pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN shipmentStatus = 'In Transit' THEN 1 ELSE 0 END) as inTransit,
      SUM(CASE WHEN shipmentStatus = 'Delivered' THEN 1 ELSE 0 END) as delivered
    FROM Shipment
    WHERE DATE(shipmentDate) = CURDATE()
    GROUP BY DATE(shipmentDate)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/weekly', (req, res) => {
  const query = `
    SELECT 
      WEEK(shipmentDate) as week,
      YEAR(shipmentDate) as year,
      COUNT(*) as totalShipments,
      SUM(CASE WHEN shipmentStatus = 'Pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN shipmentStatus = 'In Transit' THEN 1 ELSE 0 END) as inTransit,
      SUM(CASE WHEN shipmentStatus = 'Delivered' THEN 1 ELSE 0 END) as delivered
    FROM Shipment
    WHERE shipmentDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY WEEK(shipmentDate), YEAR(shipmentDate)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/monthly', (req, res) => {
  const query = `
    SELECT 
      MONTH(shipmentDate) as month,
      YEAR(shipmentDate) as year,
      COUNT(*) as totalShipments,
      SUM(CASE WHEN shipmentStatus = 'Pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN shipmentStatus = 'In Transit' THEN 1 ELSE 0 END) as inTransit,
      SUM(CASE WHEN shipmentStatus = 'Delivered' THEN 1 ELSE 0 END) as delivered
    FROM Shipment
    WHERE shipmentDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY MONTH(shipmentDate), YEAR(shipmentDate)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/suppliers', (req, res) => {
  const query = `
    SELECT 
      s.supplierCode,
      s.supplierName,
      s.telephone,
      s.address,
      s.email,
      COUNT(sh.id) as totalShipments,
      SUM(CASE WHEN sh.shipmentStatus = 'Delivered' THEN 1 ELSE 0 END) as deliveredShipments
    FROM Supplier s
    LEFT JOIN Shipment sh ON s.supplierCode = sh.supplierCode
    GROUP BY s.supplierCode, s.supplierName, s.telephone, s.address, s.email
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/shipments', (req, res) => {
  const query = `
    SELECT 
      sh.shipmentNumber,
      sh.shipmentDate,
      sh.shipmentStatus,
      sh.destination,
      s.supplierName,
      COUNT(d.id) as totalDeliveries,
      SUM(d.quantityDelivered) as totalQuantity
    FROM Shipment sh
    LEFT JOIN Supplier s ON sh.supplierCode = s.supplierCode
    LEFT JOIN Delivery d ON sh.shipmentNumber = d.shipmentNumber
    GROUP BY sh.shipmentNumber, sh.shipmentDate, sh.shipmentStatus, sh.destination, s.supplierName
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
