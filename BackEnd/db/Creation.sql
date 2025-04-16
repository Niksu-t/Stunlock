-- Drops database if it exists and afterwards creates it

DROP DATABASE IF EXISTS Stunlock;
CREATE DATABASE Stunlock;
USE Stunlock;


-- Creates tables for the database
CREATE TABLE CareGroup (
    name VARCHAR(50) NOT NULL,
    group_id INT AUTO_INCREMENT PRIMARY KEY
);


CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(10) DEFAULT 'patient',
    care_team INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (care_team) REFERENCES CareGroup(group_id)
);

CREATE TABLE diary_entries(
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    stress_gauge INT DEFAULT 0,
    pain_gauge INT DEFAULT 0,
    stiffness_gauge INT DEFAULT 0,
    sleep_gauge INT DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Add option for no care group
INSERT INTO CareGroup (name) VALUES
    ("none");