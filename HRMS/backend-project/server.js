const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors({
  origin: 'http://localhost:3004',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'hrms-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'HRMS'
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
  const query = 'SELECT * FROM Users WHERE UserName = ? AND Password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      req.session.user = results[0];
      res.json({ message: 'Login successful', user: results[0] });
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/check', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

// Department routes - CRUD
app.post('/api/departments', (req, res) => {
  const { departmentCode, departmentName } = req.body;
  const query = 'INSERT INTO Department (DepartmentCode, DepartmentName) VALUES (?, ?)';
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

app.get('/api/departments/:id', (req, res) => {
  db.query('SELECT * FROM Department WHERE id = ?', [req.params.id], (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results[0]);
  });
});

app.put('/api/departments/:id', (req, res) => {
  const { departmentCode, departmentName } = req.body;
  const query = 'UPDATE Department SET DepartmentCode = ?, DepartmentName = ? WHERE id = ?';
  db.query(query, [departmentCode, departmentName, req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Department updated' });
  });
});

app.delete('/api/departments/:id', (req, res) => {
  db.query('DELETE FROM Department WHERE id = ?', [req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Department deleted' });
  });
});

// Position routes - CRUD
app.post('/api/positions', (req, res) => {
  const { positionCode, positionName, requiredQualification } = req.body;
  const query = 'INSERT INTO Position (PositionCode, PositionName, RequiredQualification) VALUES (?, ?, ?)';
  db.query(query, [positionCode, positionName, requiredQualification], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Position created', id: result.insertId });
  });
});

app.get('/api/positions', (req, res) => {
  db.query('SELECT * FROM Position', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/positions/:id', (req, res) => {
  db.query('SELECT * FROM Position WHERE id = ?', [req.params.id], (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results[0]);
  });
});

app.put('/api/positions/:id', (req, res) => {
  const { positionCode, positionName, requiredQualification } = req.body;
  const query = 'UPDATE Position SET PositionCode = ?, PositionName = ?, RequiredQualification = ? WHERE id = ?';
  db.query(query, [positionCode, positionName, requiredQualification, req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Position updated' });
  });
});

app.delete('/api/positions/:id', (req, res) => {
  db.query('DELETE FROM Position WHERE id = ?', [req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Position deleted' });
  });
});

// Employee routes - CRUD with search
app.post('/api/employees', (req, res) => {
  const { empNumber, empFirstName, empLastName, empGender, empDateOfBirth, empEmail, empTelephone, empAddress, empStatus, departmentCode, positionCode } = req.body;
  const query = 'INSERT INTO Employee (EmpNumber, EmpFirstName, EmpLastName, EmpGender, EmpDateOfBirth, EmpEmail, EmpTelephone, EmpAddress, EmpStatus, DepartmentCode, PositionCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [empNumber, empFirstName, empLastName, empGender, empDateOfBirth, empEmail, empTelephone, empAddress, empStatus, departmentCode, positionCode], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Employee created', id: result.insertId });
  });
});

app.get('/api/employees', (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM Employee';
  let params = [];
  
  if (search) {
    query += ' WHERE EmpFirstName LIKE ? OR EmpLastName LIKE ? OR EmpEmail LIKE ? OR EmpTelephone LIKE ?';
    params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
  }
  
  db.query(query, params, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/employees/:id', (req, res) => {
  db.query('SELECT * FROM Employee WHERE id = ?', [req.params.id], (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results[0]);
  });
});

app.put('/api/employees/:id', (req, res) => {
  const { empNumber, empFirstName, empLastName, empGender, empDateOfBirth, empEmail, empTelephone, empAddress, empStatus, departmentCode, positionCode } = req.body;
  const query = 'UPDATE Employee SET EmpNumber = ?, EmpFirstName = ?, EmpLastName = ?, EmpGender = ?, EmpDateOfBirth = ?, EmpEmail = ?, EmpTelephone = ?, EmpAddress = ?, EmpStatus = ?, DepartmentCode = ?, PositionCode = ? WHERE id = ?';
  db.query(query, [empNumber, empFirstName, empLastName, empGender, empDateOfBirth, empEmail, empTelephone, empAddress, empStatus, departmentCode, positionCode, req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Employee updated' });
  });
});

app.delete('/api/employees/:id', (req, res) => {
  db.query('DELETE FROM Employee WHERE id = ?', [req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Employee deleted' });
  });
});

// Users routes - CRUD
app.post('/api/users', (req, res) => {
  const { userName, password, empNumber } = req.body;
  const query = 'INSERT INTO Users (UserName, Password, EmpNumber) VALUES (?, ?, ?)';
  db.query(query, [userName, password, empNumber], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'User created', id: result.insertId });
  });
});

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM Users', (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/users/:id', (req, res) => {
  db.query('SELECT * FROM Users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results[0]);
  });
});

app.put('/api/users/:id', (req, res) => {
  const { userName, password, empNumber } = req.body;
  const query = 'UPDATE Users SET UserName = ?, Password = ?, EmpNumber = ? WHERE id = ?';
  db.query(query, [userName, password, empNumber, req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'User updated' });
  });
});

app.delete('/api/users/:id', (req, res) => {
  db.query('DELETE FROM Users WHERE id = ?', [req.params.id], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'User deleted' });
  });
});

// Employee Status Report
app.get('/api/reports/employee-status', (req, res) => {
  const query = `
    SELECT 
      d.DepartmentName,
      e.EmpFirstName,
      e.EmpLastName,
      e.EmpStatus,
      p.PositionName
    FROM Employee e
    LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
    LEFT JOIN Position p ON e.PositionCode = p.PositionCode
    ORDER BY d.DepartmentName, e.EmpLastName, e.EmpFirstName
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get('/api/reports/employee-status-summary', (req, res) => {
  const query = `
    SELECT 
      d.DepartmentName,
      COUNT(*) as TotalEmployees,
      SUM(CASE WHEN e.EmpStatus = 'On Leave' THEN 1 ELSE 0 END) as OnLeave,
      SUM(CASE WHEN e.EmpStatus = 'Left' THEN 1 ELSE 0 END) as Left,
      SUM(CASE WHEN e.EmpStatus = 'Blacklisted' THEN 1 ELSE 0 END) as Blacklisted,
      SUM(CASE WHEN e.EmpStatus = 'Deceased' THEN 1 ELSE 0 END) as Deceased,
      SUM(CASE WHEN e.EmpStatus = 'Active' THEN 1 ELSE 0 END) as Active
    FROM Department d
    LEFT JOIN Employee e ON d.DepartmentCode = e.DepartmentCode
    GROUP BY d.DepartmentName
  `;
  db.query(query, (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
