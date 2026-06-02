-- Create database
CREATE DATABASE IF NOT EXISTS SMS;
USE SMS;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Insert default user (username: admin, password: admin123)
INSERT INTO users (username, password) VALUES ('admin', 'admin123');

-- Create Product table
CREATE TABLE IF NOT EXISTS Product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productCode VARCHAR(50) UNIQUE NOT NULL,
  productName VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantityInStock INT DEFAULT 0,
  unitPrice DECIMAL(10, 2),
  supplierName VARCHAR(255),
  dateReceived DATE
);

-- Create Warehouse table
CREATE TABLE IF NOT EXISTS Warehouse (
  id INT AUTO_INCREMENT PRIMARY KEY,
  warehouseCode VARCHAR(50) UNIQUE NOT NULL,
  warehouseName VARCHAR(255) NOT NULL,
  warehouseLocation VARCHAR(255)
);

-- Create StockTransaction table
CREATE TABLE IF NOT EXISTS StockTransaction (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transactionDate DATE NOT NULL,
  quantityMoved INT NOT NULL,
  transactionType ENUM('IN', 'OUT') NOT NULL,
  productCode VARCHAR(50),
  warehouseCode VARCHAR(50),
  FOREIGN KEY (productCode) REFERENCES Product(productCode),
  FOREIGN KEY (warehouseCode) REFERENCES Warehouse(warehouseCode)
);
