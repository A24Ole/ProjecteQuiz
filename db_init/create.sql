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
(1, 'img/bmw.png', 'BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 1),
(2, 'img/audi.png', 'Porsche', 'Audi', 'Ferrari', 'Mazda', 2),
(3, 'img/mercedes.png', 'Peugeot', 'Toyota', 'Mercedes-Benz', 'Honda', 3),
(4, 'img/volkswagen.png', 'Volkswagen', 'Nissan', 'Hyundai', 'Fiat', 1),
(5, 'img/toyota.png', 'Lexus', 'Toyota', 'Mazda', 'Subaru', 2),
(6, 'img/nissan.png', 'Nissan', 'Honda', 'Kia', 'Opel', 1),
(7, 'img/honda.png', 'Honda', 'Hyundai', 'Suzuki', 'Chevrolet', 1),
(8, 'img/ford.png', 'Ford', 'Fiat', 'Jeep', 'Dodge', 1),
(9, 'img/chevrolet.png', 'Chevrolet', 'Toyota', 'Ford', 'Buick', 1),
(10, 'img/fiat.png', 'Renault', 'Citroën', 'Fiat', 'Seat', 3),
(11, 'img/seat.png', 'Seat', 'Skoda', 'Peugeot', 'Renault', 1),
(12, 'img/renault.png', 'Dacia', 'Renault', 'Alfa Romeo', 'Fiat', 2),
(13, 'img/peugeot.png', 'Citroën', 'Peugeot', 'Jaguar', 'Seat', 2),
(14, 'img/skoda.png', 'Volkswagen', 'Seat', 'Škoda', 'Mini', 3),
(15, 'img/jaguar.png', 'Jaguar', 'Porsche', 'Ferrari', 'Maserati', 1),
(16, 'img/ferrari.png', 'Ferrari', 'Lamborghini', 'Maserati', 'Porsche', 1),
(17, 'img/lamborghini.png', 'McLaren', 'Lamborghini', 'Bugatti', 'Ferrari', 2),
(18, 'img/bugatti.png', 'Pagani', 'Bugatti', 'Koenigsegg', 'Lotus', 2),
(19, 'img/porsche.png', 'Porsche', 'Jaguar', 'Lexus', 'Audi', 1),
(20, 'img/mazda.png', 'Mazda', 'Honda', 'Hyundai', 'Toyota', 1);

COMMIT;

