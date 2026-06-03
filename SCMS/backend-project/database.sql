-- Create database
CREATE DATABASE IF NOT EXISTS SCMS;
USE SCMS;

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

-- Create Supplier table
CREATE TABLE IF NOT EXISTS Supplier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supplierCode VARCHAR(50) UNIQUE NOT NULL,
  supplierName VARCHAR(255) NOT NULL,
  telephone VARCHAR(50),
  address VARCHAR(255),
  email VARCHAR(255)
);

-- Create Shipment table
CREATE TABLE IF NOT EXISTS Shipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shipmentNumber VARCHAR(50) UNIQUE NOT NULL,
  shipmentDate DATE NOT NULL,
  shipmentStatus ENUM('Pending', 'In Transit', 'Delivered') DEFAULT 'Pending',
  destination VARCHAR(255),
  supplierCode VARCHAR(50),
  FOREIGN KEY (supplierCode) REFERENCES Supplier(supplierCode)
);

-- Create Delivery table
CREATE TABLE IF NOT EXISTS Delivery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  deliveryCode VARCHAR(50) UNIQUE NOT NULL,
  deliveryDate DATE NOT NULL,
  quantityDelivered INT DEFAULT 0,
  deliveryStatus ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
  shipmentNumber VARCHAR(50),
  FOREIGN KEY (shipmentNumber) REFERENCES Shipment(shipmentNumber)
);
