const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'SMS'
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

// Product routes - Insert only
app.post('/api/products', (req, res) => {
  const { productCode, productName, category, quantityInStock, unitPrice, supplierName, dateReceived } = req.body;
  const query = 'INSERT INTO Product (productCode, productName, category, quantityInStock, unitPrice, supplierName, dateReceived) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [productCode, productName, category, quantityInStock, unitPrice, supplierName, dateReceived], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Product created', id: result.insertId });
  });
});

app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM Product', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// Warehouse routes - Insert only
app.post('/api/warehouses', (req, res) => {
  const { warehouseCode, warehouseName, warehouseLocation } = req.body;
  const query = 'INSERT INTO Warehouse (warehouseCode, warehouseName, warehouseLocation) VALUES (?, ?, ?)';
  db.query(query, [warehouseCode, warehouseName, warehouseLocation], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Warehouse created', id: result.insertId });
  });
});

app.get('/api/warehouses', (req, res) => {
  db.query('SELECT * FROM Warehouse', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// StockTransaction routes - Insert, Delete, Update, Retrieve
app.post('/api/transactions', (req, res) => {
  const { transactionDate, quantityMoved, transactionType, productCode, warehouseCode } = req.body;
  const query = 'INSERT INTO StockTransaction (transactionDate, quantityMoved, transactionType, productCode, warehouseCode) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [transactionDate, quantityMoved, transactionType, productCode, warehouseCode], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Transaction created', id: result.insertId });
  });
});

app.get('/api/transactions', (req, res) => {
  db.query('SELECT * FROM StockTransaction', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.put('/api/transactions/:id', (req, res) => {
  const { transactionDate, quantityMoved, transactionType, productCode, warehouseCode } = req.body;
  const query = 'UPDATE StockTransaction SET transactionDate = ?, quantityMoved = ?, transactionType = ?, productCode = ?, warehouseCode = ? WHERE id = ?';
  db.query(query, [transactionDate, quantityMoved, transactionType, productCode, warehouseCode, req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Transaction updated' });
  });
});

app.delete('/api/transactions/:id', (req, res) => {
  db.query('DELETE FROM StockTransaction WHERE id = ?', [req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Transaction deleted' });
  });
});

// Reports routes
app.get('/api/reports/daily', (req, res) => {
  const query = `
    SELECT 
      DATE(transactionDate) as date,
      COUNT(*) as totalTransactions,
      SUM(CASE WHEN transactionType = 'IN' THEN quantityMoved ELSE 0 END) as totalStockIn,
      SUM(CASE WHEN transactionType = 'OUT' THEN quantityMoved ELSE 0 END) as totalStockOut
    FROM StockTransaction
    WHERE DATE(transactionDate) = CURDATE()
    GROUP BY DATE(transactionDate)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/weekly', (req, res) => {
  const query = `
    SELECT 
      WEEK(transactionDate) as week,
      YEAR(transactionDate) as year,
      COUNT(*) as totalTransactions,
      SUM(CASE WHEN transactionType = 'IN' THEN quantityMoved ELSE 0 END) as totalStockIn,
      SUM(CASE WHEN transactionType = 'OUT' THEN quantityMoved ELSE 0 END) as totalStockOut
    FROM StockTransaction
    WHERE transactionDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY WEEK(transactionDate), YEAR(transactionDate)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/monthly', (req, res) => {
  const query = `
    SELECT 
      MONTH(transactionDate) as month,
      YEAR(transactionDate) as year,
      COUNT(*) as totalTransactions,
      SUM(CASE WHEN transactionType = 'IN' THEN quantityMoved ELSE 0 END) as totalStockIn,
      SUM(CASE WHEN transactionType = 'OUT' THEN quantityMoved ELSE 0 END) as totalStockOut
    FROM StockTransaction
    WHERE transactionDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY MONTH(transactionDate), YEAR(transactionDate)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/stock', (req, res) => {
  const query = `
    SELECT 
      p.productCode,
      p.productName,
      p.category,
      p.quantityInStock,
      p.unitPrice,
      p.supplierName,
      SUM(CASE WHEN st.transactionType = 'IN' THEN st.quantityMoved ELSE 0 END) as totalIn,
      SUM(CASE WHEN st.transactionType = 'OUT' THEN st.quantityMoved ELSE 0 END) as totalOut
    FROM Product p
    LEFT JOIN StockTransaction st ON p.productCode = st.productCode
    GROUP BY p.productCode, p.productName, p.category, p.quantityInStock, p.unitPrice, p.supplierName
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
