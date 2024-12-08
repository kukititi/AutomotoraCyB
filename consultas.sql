DROP TABLE IF EXISTS sucursal;

DROP TABLE IF EXISTS empleado;

DROP TABLE IF EXISTS vehiculo;

DROP TABLE IF EXISTS aseguradora;

DROP TABLE IF EXISTS aceite;

DROP TABLE IF EXISTS motor;

CREATE TABLE IF NOT EXISTS sucursal (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, teléfono  INTEGER, gerente TEXT NOT NULL, empleado TEXT NOT NULL, ciudad TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS empleado (Rut INTEGER PRIMARY KEY, nombre TEXT NOT NULL, apellido TEXT NOT NULL, cargo TEXT NOT NULL, id_sucursal INTEGER NOT NULL, teléfono INTEGER, salario INTEGER);

CREATE TABLE IF NOT EXISTS vehiculo (patente TEXT NOT NULL PRIMARY KEY, modelo TEXT NOT NULL, marca TEXT NOT NULL, anio INTEGER, tipo_vehiculo TEXT NOT NULL, color TEXT NOT NULL, estado BOOLEAN, precio INTEGER, combustible TEXT NOT NULL, num_serie_motor INTEGER, consumo_combustible INTEGER, capacidad INTEGER, kilometraje INTEGER, num_infracciones INTEGER);

CREATE TABLE IF NOT EXISTS aseguradora (id_seguro SERIAL PRIMARY KEY, tipo TEXT NOT NULL, cobertura TEXT NOT NULL, precio INTEGER, fecha_vigencia DATE);

CREATE TABLE IF NOT EXISTS motor (num_serie INTEGER PRIMARY KEY, fabricante TEXT NOT NULL, potencia INTEGER, tipo_motor TEXT NOT NULL, consumo INTEGER, estado BOOLEAN, fecha_mantenimiento DATE, stock INTEGER);

CREATE TABLE IF NOT EXISTS aceite (id_aceite SERIAL PRIMARY KEY, marca TEXT NOT NULL, viscosidad TEXT NOT NULL, tipo_aceite TEXT NOT NULL, aprobacion_fabric BOOLEAN, capacidad INTEGER, fecha_venc DATE, stock INTEGER);

INSERT INTO vehiculo (patente, modelo, marca, anio, tipo_vehiculo, color, estado, precio, combustible, num_serie_motor, consumo_combustible, capacidad, kilometraje, num_infracciones) VALUES ('SQPR78', 'chevrolet spark gt', 'chevrolet', 2016, 'auto', 'naranja', true, 2000000000, 'bencina', 31231, 10 ,45, 10000, 0);

INSERT INTO empleado (rut, nombre, apellido, cargo, id_sucursal, teléfono, salario) VALUES (123456789, 'Nombre', 'Apellido', 'Cargo', 1, 912345678, 500000);

INSERT INTO sucursal (nombre, teléfono, gerente, empleado, ciudad) VALUES ('Sucursal Central', 912345678, 'Juan Pérez', 'María Rodríguez', 'Santiago');

INSERT INTO aseguradora (tipo, cobertura, precio, fecha_vigencia) VALUES ('Todo Riesgo', 'Completa', 500000, '2023-12-31');

INSERT INTO motor (num_serie, fabricante, potencia, tipo_motor, consumo, estado, fecha_mantenimiento, stock) VALUES (312, 'General Motors', 'motor (S-Tec) SMART-TEC', 1, usado, 2023-7-31, 32);

INSERT INTO aceite (marca, viscosidad, tipo_aceite, aprobacion_fabric, capacidad, fecha_venc, stock) VALUES ('castrol', '5W-20', 'convencional', true, 5, 2025-10-12, 60);

DELETE FROM sucursal *;

DELETE FROM aseguradora *;

DELETE FROM vehiculo *;

DELETE FROM motor *;

DELETE FROM aceite *;

DELETE FROM empleado *;

SELECT * FROM aceite;
SELECT * FROM vehiculo;
SELECT * FROM sucursal WHERE ciudad = 'Santiago';
SELECT * FROM aseguradora;

SELECT v.marca, v.modelo, SUM(ve.cantidad) AS total_vendido 
FROM Ventas ve
JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
WHERE ve.fecha_venta > DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY ve.id_vehículo
ORDER BY total_vendido DESC
LIMIT 1;

SELECT id_vehículo, COUNT(*) AS reparaciones
FROM Reparaciones
GROUP BY id_vehículo
HAVING COUNT(*) > 3;

SELECT v.marca, SUM(ve.cantidad) AS total_vendido
FROM Ventas ve
JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
WHERE v.tipo = 'moto deportiva'
GROUP BY v.marca
ORDER BY total_vendido DESC
LIMIT 1;

SELECT c.nombre, c.email, c.telefono, COUNT(ve.id_venta) AS compras
FROM Clientes c
JOIN Ventas ve ON ve.id_cliente = c.id_cliente
GROUP BY c.id_cliente
ORDER BY compras DESC
LIMIT 5;

SELECT v.color, COUNT(*) AS cantidad_ventas
FROM Ventas ve
JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
WHERE v.tipo = 'auto'
GROUP BY v.color
ORDER BY cantidad_ventas DESC
LIMIT 5;

SELECT v.color, COUNT(*) AS cantidad_ventas
FROM Ventas ve
JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
WHERE v.tipo = 'moto clásica'
GROUP BY v.color
ORDER BY cantidad_ventas DESC
LIMIT 5;

SELECT SUM(p.cantidad) AS total_neumaticos
FROM Ventas ve
JOIN Neumaticos p ON ve.id_producto = p.id_producto
WHERE p.marca = 'Michelín' AND ve.fecha_venta > DATE_SUB(CURDATE(), INTERVAL 6 MONTH);

SELECT forma_pago, COUNT(*) AS total
FROM Ventas
GROUP BY forma_pago
ORDER BY total DESC
LIMIT 1;

SELECT SUM(p.cantidad) AS total_neumaticos
FROM Ventas ve
JOIN aceite p ON ve.id_producto = p.id_producto
WHERE p.marca = 'sell' AND ve.fecha_venta > DATE_SUB(CURDATE(), INTERVAL 6 MONTH);

SELECT s.nombre AS sucursal, COUNT(ve.id_venta) AS cantidad_ventas
FROM Ventas ve
JOIN Sucursales s ON ve.id_sucursal = s.id_sucursal
GROUP BY ve.id_sucursal
ORDER BY cantidad_ventas DESC
LIMIT 1;



