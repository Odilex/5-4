-- Create database
CREATE DATABASE IF NOT EXISTS HRMS;
USE HRMS;

-- Create Department table
CREATE TABLE IF NOT EXISTS Department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  DepartmentCode VARCHAR(50) UNIQUE NOT NULL,
  DepartmentName VARCHAR(255) NOT NULL
);

-- Create Position table
CREATE TABLE IF NOT EXISTS Position (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PositionCode VARCHAR(50) UNIQUE NOT NULL,
  PositionName VARCHAR(255) NOT NULL,
  RequiredQualification VARCHAR(255)
);

-- Create Employee table
CREATE TABLE IF NOT EXISTS Employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  EmpNumber VARCHAR(50) UNIQUE NOT NULL,
  EmpFirstName VARCHAR(255) NOT NULL,
  EmpLastName VARCHAR(255) NOT NULL,
  EmpGender ENUM('Male', 'Female', 'Other'),
  EmpDateOfBirth DATE,
  EmpEmail VARCHAR(255),
  EmpTelephone VARCHAR(50),
  EmpAddress VARCHAR(255),
  EmpStatus ENUM('Active', 'On Leave', 'Left', 'Blacklisted', 'Deceased') DEFAULT 'Active',
  DepartmentCode VARCHAR(50),
  PositionCode VARCHAR(50),
  FOREIGN KEY (DepartmentCode) REFERENCES Department(DepartmentCode),
  FOREIGN KEY (PositionCode) REFERENCES Position(PositionCode)
);

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  UserName VARCHAR(50) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  EmpNumber VARCHAR(50),
  FOREIGN KEY (EmpNumber) REFERENCES Employee(EmpNumber)
);

-- Insert default user (username: admin, password: admin123)
-- Note: This requires an employee to exist first, so we'll insert a default employee first
INSERT INTO Department (DepartmentCode, DepartmentName) VALUES ('DEPT001', 'Administration');
INSERT INTO Position (PositionCode, PositionName, RequiredQualification) VALUES ('POS001', 'System Administrator', 'Bachelor Degree');
INSERT INTO Employee (EmpNumber, EmpFirstName, EmpLastName, EmpGender, EmpDateOfBirth, EmpEmail, EmpTelephone, EmpAddress, EmpStatus, DepartmentCode, PositionCode) 
VALUES ('EMP001', 'Admin', 'User', 'Male', '1990-01-01', 'admin@hrms.com', '0780000000', 'Kigali', 'Active', 'DEPT001', 'POS001');
INSERT INTO Users (UserName, Password, EmpNumber) VALUES ('admin', 'admin123', 'EMP001');

-- Insert melissa user (username: melissa, password: melissa123)
-- Note: This requires an employee to exist first, so we'll insert a default employee first
INSERT INTO Employee (EmpNumber, EmpFirstName, EmpLastName, EmpGender, EmpDateOfBirth, EmpEmail, EmpTelephone, EmpAddress, EmpStatus, DepartmentCode, PositionCode) 
VALUES ('EMP002', 'Melissa', 'User', 'Female', '1995-05-15', 'melissa@hrms.com', '0780000001', 'Kigali', 'Active', 'DEPT001', 'POS001');
INSERT INTO Users (UserName, Password, EmpNumber) VALUES ('melissa', 'melissa123', 'EMP002');
