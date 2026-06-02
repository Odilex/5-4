const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'SRMS'
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

// Customer routes - Insert only
app.post('/api/customers', (req, res) => {
  const { customerNumber, firstName, lastName, telephone, address } = req.body;
  const query = 'INSERT INTO Customer (customerNumber, firstName, lastName, telephone, address) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [customerNumber, firstName, lastName, telephone, address], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Customer created', id: result.insertId });
  });
});

app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM Customer', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// Product routes - Insert only
app.post('/api/products', (req, res) => {
  const { productCode, productName, quantitySold, unitPrice } = req.body;
  const query = 'INSERT INTO Product (productCode, productName, quantitySold, unitPrice) VALUES (?, ?, ?, ?)';
  db.query(query, [productCode, productName, quantitySold, unitPrice], (err, result) => {
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

// Sale routes - Insert, Delete, Update, Retrieve
app.post('/api/sales', (req, res) => {
  const { invoiceNumber, salesDate, paymentMethod, totalAmountPaid, customerNumber, productCode } = req.body;
  const query = 'INSERT INTO Sale (invoiceNumber, salesDate, paymentMethod, totalAmountPaid, customerNumber, productCode) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [invoiceNumber, salesDate, paymentMethod, totalAmountPaid, customerNumber, productCode], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Sale created', id: result.insertId });
  });
});

app.get('/api/sales', (req, res) => {
  db.query('SELECT * FROM Sale', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.put('/api/sales/:id', (req, res) => {
  const { invoiceNumber, salesDate, paymentMethod, totalAmountPaid, customerNumber, productCode } = req.body;
  const query = 'UPDATE Sale SET invoiceNumber = ?, salesDate = ?, paymentMethod = ?, totalAmountPaid = ?, customerNumber = ?, productCode = ? WHERE id = ?';
  db.query(query, [invoiceNumber, salesDate, paymentMethod, totalAmountPaid, customerNumber, productCode, req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Sale updated' });
  });
});

app.delete('/api/sales/:id', (req, res) => {
  db.query('DELETE FROM Sale WHERE id = ?', [req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Sale deleted' });
  });
});

// Reports routes
app.get('/api/reports/daily', (req, res) => {
  const query = `
    SELECT 
      DATE(salesDate) as date,
      COUNT(*) as totalSales,
      SUM(totalAmountPaid) as totalRevenue
    FROM Sale
    WHERE DATE(salesDate) = CURDATE()
    GROUP BY DATE(salesDate)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/weekly', (req, res) => {
  const query = `
    SELECT 
      WEEK(salesDate) as week,
      YEAR(salesDate) as year,
      COUNT(*) as totalSales,
      SUM(totalAmountPaid) as totalRevenue
    FROM Sale
    WHERE salesDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY WEEK(salesDate), YEAR(salesDate)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/monthly', (req, res) => {
  const query = `
    SELECT 
      MONTH(salesDate) as month,
      YEAR(salesDate) as year,
      COUNT(*) as totalSales,
      SUM(totalAmountPaid) as totalRevenue
    FROM Sale
    WHERE salesDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY MONTH(salesDate), YEAR(salesDate)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/customers', (req, res) => {
  const query = `
    SELECT 
      c.customerNumber,
      c.firstName,
      c.lastName,
      c.telephone,
      c.address,
      COUNT(s.id) as totalPurchases,
      SUM(s.totalAmountPaid) as totalSpent
    FROM Customer c
    LEFT JOIN Sale s ON c.customerNumber = s.customerNumber
    GROUP BY c.customerNumber, c.firstName, c.lastName, c.telephone, c.address
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/products', (req, res) => {
  const query = `
    SELECT 
      p.productCode,
      p.productName,
      p.quantitySold,
      p.unitPrice,
      COUNT(s.id) as timesSold,
      SUM(s.totalAmountPaid) as totalRevenue
    FROM Product p
    LEFT JOIN Sale s ON p.productCode = s.productCode
    GROUP BY p.productCode, p.productName, p.quantitySold, p.unitPrice
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
