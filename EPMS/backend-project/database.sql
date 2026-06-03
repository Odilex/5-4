-- Create database
CREATE DATABASE IF NOT EXISTS EPMS;
USE EPMS;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Insert default user (username: admin, password: admin123)
INSERT INTO users (username, password) VALUES ('admin', 'admin123');

-- Insert melissa user (username: melissa, password: melissa123)
INSERT INTO users (username, password) VALUES ('melissa', 'melissa123');

-- Create Department table
CREATE TABLE IF NOT EXISTS Department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  departmentCode VARCHAR(50) UNIQUE NOT NULL,
  departmentName VARCHAR(255) NOT NULL
);

-- Create Employee table
CREATE TABLE IF NOT EXISTS Employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employeeNumber VARCHAR(50) UNIQUE NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  position VARCHAR(255),
  telephone VARCHAR(50),
  gender ENUM('Male', 'Female', 'Other'),
  hiredDate DATE,
  departmentCode VARCHAR(50),
  FOREIGN KEY (departmentCode) REFERENCES Department(departmentCode)
);

-- Create Salary table
CREATE TABLE IF NOT EXISTS Salary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grossSalary DECIMAL(10, 2),
  totalDeduction DECIMAL(10, 2),
  netSalary DECIMAL(10, 2),
  monthOfPayment DATE,
  employeeNumber VARCHAR(50),
  FOREIGN KEY (employeeNumber) REFERENCES Employee(employeeNumber)
);
