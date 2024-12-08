import express from 'express';
import bodyParser from 'body-parser';
import { neon } from '@neondatabase/serverless';
import path from 'path';

const app = express();
const port = 3000;

// Configurar la conexión a Neon
const sql = neon(
  'postgresql://neondb_owner:dmteZW7Fq3Ph@ep-steep-bar-a5mvqh21.us-east-2.aws.neon.tech/neondb?sslmode=require'
);

// Middleware para parsear JSON
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta "public"
const __dirname = path.resolve(); // Obtener la ruta absoluta del proyecto
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para manejar consultas a la base de datos
app.post('/consulta', async (req, res) => {
  const { tabla } = req.body;

  if (!tabla) {
    return res.status(400).json({ error: 'Por favor, especifica una tabla.' });
  }

  try {
    const resultados = await sql(`${tabla}`);
    res.json(resultados);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al realizar la consulta.' });
  }
});

// Redirigir todas las rutas no especificadas a index.html (ideal para SPA o rutas desconocidas)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`tuki`);
});
