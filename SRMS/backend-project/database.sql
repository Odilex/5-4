-- Create database
CREATE DATABASE IF NOT EXISTS SRMS;
USE SRMS;

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

-- Create Customer table
CREATE TABLE IF NOT EXISTS Customer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customerNumber VARCHAR(50) UNIQUE NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  telephone VARCHAR(50),
  address VARCHAR(255)
);

-- Create Product table
CREATE TABLE IF NOT EXISTS Product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productCode VARCHAR(50) UNIQUE NOT NULL,
  productName VARCHAR(255) NOT NULL,
  quantitySold INT DEFAULT 0,
  unitPrice DECIMAL(10, 2)
);

-- Create Sale table
CREATE TABLE IF NOT EXISTS Sale (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoiceNumber VARCHAR(50) UNIQUE NOT NULL,
  salesDate DATE NOT NULL,
  paymentMethod VARCHAR(50),
  totalAmountPaid DECIMAL(10, 2),
  customerNumber VARCHAR(50),
  productCode VARCHAR(50),
  FOREIGN KEY (customerNumber) REFERENCES Customer(customerNumber),
  FOREIGN KEY (productCode) REFERENCES Product(productCode)
);
