import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Obtener rutas absolutas CORRECTAMENTE
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar archivos estáticos (usa path.join para evitar errores de rutas)
app.use(express.static(path.join(__dirname, 'public')));  // Para CSS, JS, imágenes
app.use(express.static(path.join(__dirname, 'pages')));   // Para archivos HTML

// Ruta principal CORREGIDA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'indexHome.html')); // Asegúrate que coincide con el nombre real
});
app.get('/Menu', (req, res) => { 
  res.sendFile(path.join(__dirname, 'pages', 'indexMenu.html'));
}); 

app.get('/Contactanos', (req, res) => { 
  res.sendFile(path.join(__dirname, 'pages', 'indexContactanos.html'));
}); 


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});