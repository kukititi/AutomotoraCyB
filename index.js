import express from 'express';
import fs from 'fs';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000;

const app = express();

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // tu usuario
  password: '', // tu contraseña
  database: 'tu_base_de_datos', // nombre de tu base de datos
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Middleware para recibir datos JSON
app.use(express.json());

// Ruta para manejar consultas
app.post('/consulta', (req, res) => {
  const { consulta } = req.body; // Recibe la consulta desde el frontend

  // Leer el archivo SQL con las consultas
  const filePath = path.join(__dirname, 'consultas.sql');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo de consultas.');
    }

    // Ejecutar la consulta seleccionada
    db.query(data, (err, results) => {
      if (err) {
        return res.status(500).send('Error al ejecutar la consulta.');
      }
      res.json(results); // Enviar los resultados al frontend
    });
  });
});

// Redirigir todas las rutas no especificadas a index.html (ideal para SPA o rutas desconocidas)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`tuki`);
});
