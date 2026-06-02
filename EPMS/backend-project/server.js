const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'EPMS'
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

// Employee routes - Insert only
app.post('/api/employees', (req, res) => {
  const { employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode } = req.body;
  const query = 'INSERT INTO Employee (employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [employeeNumber, firstName, lastName, address, position, telephone, gender, hiredDate, departmentCode], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Employee created', id: result.insertId });
  });
});

app.get('/api/employees', (req, res) => {
  db.query('SELECT * FROM Employee', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// Department routes - Insert only
app.post('/api/departments', (req, res) => {
  const { departmentCode, departmentName } = req.body;
  const query = 'INSERT INTO Department (departmentCode, departmentName) VALUES (?, ?)';
  db.query(query, [departmentCode, departmentName], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Department created', id: result.insertId });
  });
});

app.get('/api/departments', (req, res) => {
  db.query('SELECT * FROM Department', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

// Salary routes - Insert, Delete, Update, Retrieve
app.post('/api/salaries', (req, res) => {
  const { grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber } = req.body;
  const query = 'INSERT INTO Salary (grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Salary created', id: result.insertId });
  });
});

app.get('/api/salaries', (req, res) => {
  db.query('SELECT * FROM Salary', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.put('/api/salaries/:id', (req, res) => {
  const { grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber } = req.body;
  const query = 'UPDATE Salary SET grossSalary = ?, totalDeduction = ?, netSalary = ?, monthOfPayment = ?, employeeNumber = ? WHERE id = ?';
  db.query(query, [grossSalary, totalDeduction, netSalary, monthOfPayment, employeeNumber, req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Salary updated' });
  });
});

app.delete('/api/salaries/:id', (req, res) => {
  db.query('DELETE FROM Salary WHERE id = ?', [req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Salary deleted' });
  });
});

// Reports routes
app.get('/api/reports/daily', (req, res) => {
  const query = `
    SELECT 
      DATE(monthOfPayment) as date,
      COUNT(*) as totalPayments,
      SUM(netSalary) as totalNetSalary,
      SUM(grossSalary) as totalGrossSalary,
      SUM(totalDeduction) as totalDeductions
    FROM Salary
    WHERE DATE(monthOfPayment) = CURDATE()
    GROUP BY DATE(monthOfPayment)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/weekly', (req, res) => {
  const query = `
    SELECT 
      WEEK(monthOfPayment) as week,
      YEAR(monthOfPayment) as year,
      COUNT(*) as totalPayments,
      SUM(netSalary) as totalNetSalary,
      SUM(grossSalary) as totalGrossSalary,
      SUM(totalDeduction) as totalDeductions
    FROM Salary
    WHERE monthOfPayment >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY WEEK(monthOfPayment), YEAR(monthOfPayment)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/monthly', (req, res) => {
  const query = `
    SELECT 
      MONTH(monthOfPayment) as month,
      YEAR(monthOfPayment) as year,
      COUNT(*) as totalPayments,
      SUM(netSalary) as totalNetSalary,
      SUM(grossSalary) as totalGrossSalary,
      SUM(totalDeduction) as totalDeductions
    FROM Salary
    WHERE monthOfPayment >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY MONTH(monthOfPayment), YEAR(monthOfPayment)
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/employees', (req, res) => {
  const query = `
    SELECT 
      e.employeeNumber,
      e.firstName,
      e.lastName,
      e.position,
      e.gender,
      e.hiredDate,
      d.departmentName,
      COUNT(s.id) as totalPayments,
      SUM(s.netSalary) as totalPaid
    FROM Employee e
    LEFT JOIN Department d ON e.departmentCode = d.departmentCode
    LEFT JOIN Salary s ON e.employeeNumber = s.employeeNumber
    GROUP BY e.employeeNumber, e.firstName, e.lastName, e.position, e.gender, e.hiredDate, d.departmentName
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/departments', (req, res) => {
  const query = `
    SELECT 
      d.departmentCode,
      d.departmentName,
      COUNT(e.id) as totalEmployees,
      SUM(s.netSalary) as totalSalaryPaid
    FROM Department d
    LEFT JOIN Employee e ON d.departmentCode = e.departmentCode
    LEFT JOIN Salary s ON e.employeeNumber = s.employeeNumber
    GROUP BY d.departmentCode, d.departmentName
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
