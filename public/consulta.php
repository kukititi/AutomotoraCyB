<?php
$servername = "localhost";
$username = "usuario";  // Cambia esto por tu usuario de base de datos
$password = "contraseña";  // Cambia esto por tu contraseña de base de datos
$dbname = "base_de_datos";  // Cambia esto por el nombre de tu base de datos

// Conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$queryId = $_POST['queryId'];

// Definir las consultas SQL basadas en el `queryId`
$sqlQueries = [
    1 => "SELECT v.marca, v.modelo, SUM(ve.cantidad) AS total_vendido 
          FROM Ventas ve
          JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
          WHERE ve.fecha_venta > DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
          GROUP BY ve.id_vehículo
          ORDER BY total_vendido DESC
          LIMIT 1;",
    2 => "SELECT id_vehículo, COUNT(*) AS reparaciones
          FROM Reparaciones
          GROUP BY id_vehículo
          HAVING COUNT(*) > 3;",
    3 => "SELECT v.marca, SUM(ve.cantidad) AS total_vendido
          FROM Ventas ve
          JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
          WHERE v.tipo = 'moto deportiva'
          GROUP BY v.marca
          ORDER BY total_vendido DESC
          LIMIT 1;",
    4 => "SELECT c.nombre, c.email, c.telefono, COUNT(ve.id_venta) AS compras
          FROM Clientes c
          JOIN Ventas ve ON ve.id_cliente = c.id_cliente
          GROUP BY c.id_cliente
          ORDER BY compras DESC
          LIMIT 5;",
    5 => "SELECT v.color, COUNT(*) AS cantidad_ventas
          FROM Ventas ve
          JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
          WHERE v.tipo = 'auto'
          GROUP BY v.color
          ORDER BY cantidad_ventas DESC
          LIMIT 5;",
    6 => "SELECT v.color, COUNT(*) AS cantidad_ventas
          FROM Ventas ve
          JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
          WHERE v.tipo = 'moto clásica'
          GROUP BY v.color
          ORDER BY cantidad_ventas DESC
          LIMIT 5;",
    7 => "SELECT SUM(p.cantidad) AS total_neumaticos
          FROM Ventas ve
          JOIN Neumaticos p ON ve.id_producto = p.id_producto
          WHERE p.marca = 'Michelín' AND ve.fecha_venta > DATE_SUB(CURDATE(), INTERVAL 6 MONTH);",
    8 => "SELECT forma_pago, COUNT(*) AS total
          FROM Ventas
          GROUP BY forma_pago
          ORDER BY total DESC
          LIMIT 1;",
    9 => "SELECT SUM(p.cantidad) AS total_neumaticos
          FROM Ventas ve
          JOIN aceite p ON ve.id_producto = p.id_producto
          WHERE p.marca = 'sell' AND ve.fecha_venta > DATE_SUB(CURDATE(), INTERVAL 6 MONTH);",
    10 => "SELECT s.nombre AS sucursal, COUNT(ve.id_venta) AS cantidad_ventas
           FROM Ventas ve
           JOIN Sucursales s ON ve.id_sucursal = s.id_sucursal
           GROUP BY ve.id_sucursal
           ORDER BY cantidad_ventas DESC
           LIMIT 1;"
];

$sql = $sqlQueries[$queryId];  // Selecciona la consulta según el `queryId`

// Ejecutar la consulta SQL
$result = $conn->query($sql);

// Verificar si hay resultados
if ($result->num_rows > 0) {
    $headers = [];
    $rows = [];

    // Obtener los encabezados de las columnas
    while ($field = $result->fetch_field()) {
        $headers[] = $field->name;
    }

    // Obtener las filas de resultados
    while ($row = $result->fetch_assoc()) {
        $rows[] = array_values($row);  // Convertir los valores de la fila en un arreglo simple
    }

    // Retornar los resultados en formato JSON
    echo json_encode(['headers' => $headers, 'rows' => $rows]);
} else {
    echo json_encode(['headers' => [], 'rows' => []]);  // Si no hay resultados
}

// Cerrar la conexión
$conn->close();
?>
