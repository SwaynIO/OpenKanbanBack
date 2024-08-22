#!/bin/bash

# Demande des informations de connexion à la base de données
read -p "Enter your database host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Enter your database user (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Enter your database password: " DB_PASSWORD
echo ""

read -p "Enter your database name: " DB_NAME

# Création du fichier .env avec les informations fournies par l'utilisateur
echo "Creating .env file..."
echo "DB_HOST=$DB_HOST" > .env
echo "DB_USER=$DB_USER" >> .env
echo "DB_PASSWORD=$DB_PASSWORD" >> .env
echo "DB_NAME=$DB_NAME" >> .env
echo "JWT_SECRET=mysecret" >> .env

# Installation des dépendances backend
echo "Installing backend dependencies..."
npm install

# Envoi des tables sur la base de données
echo "Setting up the database..."

mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST $DB_NAME -e "
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
START TRANSACTION;
SET time_zone = '+00:00';

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE IF NOT EXISTS \`boards\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`team_id\` int(11) DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`team_id\` (\`team_id\`),
  CONSTRAINT \`boards_ibfk_1\` FOREIGN KEY (\`team_id\`) REFERENCES \`teams\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`comments\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`task_id\` int(11) NOT NULL,
  \`user_id\` int(11) NOT NULL,
  \`content\` text NOT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`task_id\` (\`task_id\`),
  KEY \`user_id\` (\`user_id\`),
  CONSTRAINT \`comments_ibfk_1\` FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`comments_ibfk_2\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`lists\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`board_id\` int(11) DEFAULT NULL,
  \`position\` int(11) DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`board_id\` (\`board_id\`),
  CONSTRAINT \`lists_ibfk_1\` FOREIGN KEY (\`board_id\`) REFERENCES \`boards\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`tasks\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`description\` text DEFAULT NULL,
  \`list_id\` int(11) DEFAULT NULL,
  \`assigned_to\` int(11) DEFAULT NULL,
  \`position\` int(11) DEFAULT NULL,
  \`due_date\` datetime DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`list_id\` (\`list_id\`),
  KEY \`assigned_to\` (\`assigned_to\`),
  CONSTRAINT \`tasks_ibfk_1\` FOREIGN KEY (\`list_id\`) REFERENCES \`lists\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`tasks_ibfk_2\` FOREIGN KEY (\`assigned_to\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`teams\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`description\` text DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`team_members\` (
  \`user_id\` int(11) NOT NULL,
  \`team_id\` int(11) NOT NULL,
  \`role\` enum('admin','member') DEFAULT 'member',
  \`joined_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`user_id\`, \`team_id\`),
  KEY \`team_id\` (\`team_id\`),
  CONSTRAINT \`team_members_ibfk_1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`team_members_ibfk_2\` FOREIGN KEY (\`team_id\`) REFERENCES \`teams\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`username\` varchar(255) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`username\` (\`username\`),
  UNIQUE KEY \`email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
"

echo "Database setup complete!"
