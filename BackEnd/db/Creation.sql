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
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(10) DEFAULT 'patient',
    care_team INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (care_team) REFERENCES CareGroup(group_id)
);

CREATE TABLE diary_entries(
    user_id INT NOT NULL,
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    pain_gauge INT DEFAULT 0,
    sleep_gauge INT DEFAULT 0,
    food_gauge INT DEFAULT 0,
    activity_gauge INT DEFAULT 0,
    stress_gauge INT DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Add option for no care group
INSERT INTO CareGroup (name) VALUES
    ("none");