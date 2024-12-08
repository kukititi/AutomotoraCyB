import express from 'express';
import { neon } from '@neondatabase/serverless';
import path from 'path';
import cors from 'cors';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = 3000;
app.use(cors());  

const sql = neon('postgresql://neondb_owner:dmteZW7Fq3Ph@ep-steep-bar-a5mvqh21.us-east-2.aws.neon.tech/neondb?sslmode=require');

app.use(express.json());

app.post('/consulta', async (req, res) => {
  const queryId = req.body.queryId;

  const sqlQueries = {
    1: `SELECT v.marca, v.modelo, SUM(ve.cantidad) AS total_vendido
    FROM ventas ve
    JOIN vehiculo v ON ve.id_vehículo = v.id_vehiculo
    WHERE ve.fecha_venta > CURRENT_DATE - INTERVAL '6 months'
    GROUP BY v.marca, v.modelo
    ORDER BY total_vendido DESC
    LIMIT 1;`,

    2: `SELECT id_vehículo, COUNT(*) AS reparaciones
          FROM reparaciones
          GROUP BY id_vehículo
          HAVING COUNT(*) > 3;`,

    3: `SELECT v.marca, SUM(ve.cantidad) AS total_vendido
          FROM ventas ve
          JOIN vehiculo v ON ve.id_vehículo = v.id_vehiculo
          WHERE v.tipo_vehiculo = 'moto'
          GROUP BY v.marca
          ORDER BY total_vendido DESC
          LIMIT 1;`,

    4: `SELECT c.nombre, c.telefono, COUNT(ve.id_venta) AS compras
          FROM cliente c
          JOIN ventas ve ON ve.id_cliente = c.id
          GROUP BY c.id
          ORDER BY compras DESC
          LIMIT 5;`,

    5: `SELECT v.color, COUNT(*) AS cantidad_ventas
          FROM ventas ve
          JOIN vehiculo v ON ve.id_vehículo = v.id_vehiculo
          WHERE v.tipo_vehiculo = 'auto'
          GROUP BY v.color
          ORDER BY cantidad_ventas DESC
          LIMIT 5;`,

    6: `SELECT v.color, COUNT(*) AS cantidad_ventas
          FROM ventas ve
          JOIN vehiculo v ON ve.id_vehículo = v.id_vehiculo
          WHERE v.tipo_vehiculo = 'moto'
          GROUP BY v.color
          ORDER BY cantidad_ventas DESC
          LIMIT 5;`,

    7: `SELECT SUM(ve.cantidad) AS total_vendido
    FROM ventas ve
    JOIN neumatico v ON ve.id_producto = v.id_producto
    WHERE ve.fecha_venta > CURRENT_DATE - INTERVAL '6 months'
    ORDER BY total_vendido DESC
    LIMIT 1;`,

    8: `SELECT forma_pago, COUNT(*) AS total
          FROM Ventas
          GROUP BY forma_pago
          ORDER BY total DESC
          LIMIT 1;`,

    9: `SELECT SUM(ve.cantidad) AS total_vendido
    FROM ventas ve
    JOIN aceite v ON ve.id_producto = v.id
    WHERE ve.fecha_venta > CURRENT_DATE - INTERVAL '6 MONTHS'
    ORDER BY total_vendido DESC
    LIMIT 1;`,

    10: `SELECT s.nombre AS sucursal, COUNT(ve.id_venta) AS cantidad_ventas
           FROM Ventas ve
           JOIN sucursal s ON ve.sucursal = s.id
           GROUP BY ve.sucursal, s.nombre
           ORDER BY cantidad_ventas DESC
           LIMIT 1;`
  };


  const sqlQuery = sqlQueries[queryId];

  if (!sqlQuery) {
    return res.status(400).json({ error: 'Consulta no encontrada' });
  }

  try {
    const result = await sql(sqlQuery);
    
    console.log("Resultado completo de la consulta:", result);

    if (result && result.rows) {
      console.log("Filas obtenidas:", result.rows);
      const headers = Object.keys(result.rows[0]);
      const rows = result.rows.map(row => Object.values(row));

      res.json({ headers, rows });
    } else {
      console.log("No se encontraron resultados");
      res.json({ headers: [], rows: [] });
    }
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error al ejecutar la consulta' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
