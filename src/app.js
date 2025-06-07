import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Esto es para obtener la ruta absoluta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sirve archivos estáticos desde 'src/public'
app.use(express.static(path.join(__dirname, 'pages')));

// Ruta por defecto para enviar el indexHome.html cuando se accede a la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'indexHome.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});