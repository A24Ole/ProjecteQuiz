-- ======================================================
-- CONFIGURACIÓN DE BASE DE DATOS
-- ======================================================
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS Proyecto0
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON Proyecto0.* TO 'usuari';
FLUSH PRIVILEGES;

USE Proyecto0;

-- ======================================================
-- CREACIÓN DE TABLA
-- ======================================================
DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
    id INT PRIMARY KEY,
    question VARCHAR(255),
    answer1 VARCHAR(100),
    answer2 VARCHAR(100),
    answer3 VARCHAR(100),
    answer4 VARCHAR(100),
    correct_answer INT
);

-- ======================================================
-- INSERTS DE PREGUNTES (con transacción)
-- ======================================================
BEGIN;

INSERT INTO questions (id, question, answer1, answer2, answer3, answer4, correct_answer) VALUES
(1, 'img/bmw', 'BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 1),
(2, 'img/audi', 'Porsche', 'Audi', 'Ferrari', 'Mazda', 2),
(3, 'img/mercedes', 'Peugeot', 'Toyota', 'Mercedes-Benz', 'Honda', 3),
(4, 'img/volkswagen', 'Volkswagen', 'Nissan', 'Hyundai', 'Fiat', 1),
(5, 'img/toyota', 'Lexus', 'Toyota', 'Mazda', 'Subaru', 2),
(6, 'img/nissan', 'Nissan', 'Honda', 'Kia', 'Opel', 1),
(7, 'img/honda', 'Honda', 'Hyundai', 'Suzuki', 'Chevrolet', 1),
(8, 'img/ford', 'Ford', 'Fiat', 'Jeep', 'Dodge', 1),
(9, 'img/chevrolet', 'Chevrolet', 'Toyota', 'Ford', 'Buick', 1),
(10, 'img/fiat', 'Renault', 'Citroën', 'Fiat', 'Seat', 3),
(11, 'img/seat', 'Seat', 'Skoda', 'Peugeot', 'Renault', 1),
(12, 'img/renault', 'Dacia', 'Renault', 'Alfa Romeo', 'Fiat', 2),
(13, 'img/peugeot', 'Citroën', 'Peugeot', 'Jaguar', 'Seat', 2),
(14, 'img/skoda', 'Volkswagen', 'Seat', 'Škoda', 'Mini', 3),
(15, 'img/jaguar', 'Jaguar', 'Porsche', 'Ferrari', 'Maserati', 1),
(16, 'img/ferrari', 'Ferrari', 'Lamborghini', 'Maserati', 'Porsche', 1),
(17, 'img/lamborghini', 'McLaren', 'Lamborghini', 'Bugatti', 'Ferrari', 2),
(18, 'img/bugatti', 'Pagani', 'Bugatti', 'Koenigsegg', 'Lotus', 2),
(19, 'img/porsche', 'Porsche', 'Jaguar', 'Lexus', 'Audi', 1),
(20, 'img/mazda', 'Mazda', 'Honda', 'Hyundai', 'Toyota', 1);

COMMIT;
