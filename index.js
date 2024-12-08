import express from 'express';
import { neon } from '@neondatabase/serverless';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = 3000;


// Configura tu conexión a la base de datos de Neon
const sql = neon('postgresql://neondb_owner:dmteZW7Fq3Ph@ep-steep-bar-a5mvqh21.us-east-2.aws.neon.tech/neondb?sslmode=require');

// Middleware para recibir datos JSON
app.use(express.json());

// Ruta para manejar las consultas SQL
app.post('/consulta', async (req, res) => {
  const queryId = req.body.queryId;

  // Definir las consultas SQL según el queryId
  const sqlQueries = {
    1: `SELECT v.marca, v.modelo, SUM(ve.cantidad) AS total_vendido 
          FROM ventas ve
          JOIN vehiculo v ON ve.id_vehículo = v.patente
          WHERE ve.fecha_venta > CURRENT_DATE - INTERVAL '6 months'
          GROUP BY ve.id_vehículo
          ORDER BY total_vendido DESC
          LIMIT 1;`,

    2: `SELECT id_vehículo, COUNT(*) AS reparaciones
          FROM Reparaciones
          GROUP BY id_vehículo
          HAVING COUNT(*) > 3;`,

    3: `SELECT v.marca, SUM(ve.cantidad) AS total_vendido
          FROM Ventas ve
          JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
          WHERE v.tipo = 'moto deportiva'
          GROUP BY v.marca
          ORDER BY total_vendido DESC
          LIMIT 1;`,

    4: `SELECT c.nombre, c.email, c.telefono, COUNT(ve.id_venta) AS compras
          FROM Clientes c
          JOIN Ventas ve ON ve.id_cliente = c.id_cliente
          GROUP BY c.id_cliente
          ORDER BY compras DESC
          LIMIT 5;`,

    5: `SELECT v.color, COUNT(*) AS cantidad_ventas
          FROM Ventas ve
          JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
          WHERE v.tipo = 'auto'
          GROUP BY v.color
          ORDER BY cantidad_ventas DESC
          LIMIT 5;`,

    6: `SELECT v.color, COUNT(*) AS cantidad_ventas
          FROM Ventas ve
          JOIN Vehículos v ON ve.id_vehículo = v.id_vehículo
          WHERE v.tipo = 'moto clásica'
          GROUP BY v.color
          ORDER BY cantidad_ventas DESC
          LIMIT 5;`,

    7: `SELECT SUM(p.cantidad) AS total_neumaticos
          FROM Ventas ve
          JOIN Neumaticos p ON ve.id_producto = p.id_producto
          WHERE p.marca = 'Michelín' AND ve.fecha_venta > DATE_SUB(CURDATE(), INTERVAL 6 MONTH);`,

    8: `SELECT forma_pago, COUNT(*) AS total
          FROM Ventas
          GROUP BY forma_pago
          ORDER BY total DESC
          LIMIT 1;`,

    9: `SELECT SUM(p.cantidad) AS total_neumaticos
          FROM Ventas ve
          JOIN aceite p ON ve.id_producto = p.id_producto
          WHERE p.marca = 'sell' AND ve.fecha_venta > DATE_SUB(CURDATE(), INTERVAL 6 MONTH);`,

    10: `SELECT s.nombre AS sucursal, COUNT(ve.id_venta) AS cantidad_ventas
           FROM Ventas ve
           JOIN Sucursales s ON ve.id_sucursal = s.id_sucursal
           GROUP BY ve.id_sucursal
           ORDER BY cantidad_ventas DESC
           LIMIT 1;`
  };

  // Si la consulta existe en el array, ejecutarla
  const sqlQuery = sqlQueries[queryId];

  if (!sqlQuery) {
    return res.status(400).json({ error: 'Consulta no encontrada' });
  }

  try {
    // Ejecutar la consulta en Neon
    const result = await sql(sqlQuery);

    // Si hay resultados, enviarlos al frontend
    if (result && result.rows) {
      const headers = Object.keys(result.rows[0]);  // Obtener los encabezados de las columnas
      const rows = result.rows.map(row => Object.values(row));  // Obtener los valores de las filas

      res.json({ headers, rows });
    } else {
      res.json({ headers: [], rows: [] });  // Si no hay resultados
    }
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error al ejecutar la consulta' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
