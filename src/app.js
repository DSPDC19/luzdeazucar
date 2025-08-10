import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Obtener rutas absolutas CORRECTAMENTE
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar archivos estáticos (usa path.join para evitar errores de rutas)
app.use(express.static(path.join(__dirname, 'public')));  // Para CSS, JS, imágenes
app.use(express.static(path.join(__dirname, 'pages')));   // Para archivos HTML

// Ruta principal CORREGIDA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html')); // Asegúrate que coincide con el nombre real
});
app.get('/Menu', (req, res) => { 
  res.sendFile(path.join(__dirname, 'pages', 'indexMenu.html'));
}); 

app.get('/Contactanos', (req, res) => { 
  res.sendFile(path.join(__dirname, 'pages', 'indexContactanos.html'));
}); 
app.get('/Compra', (req, res) => { 
  res.sendFile(path.join(__dirname, 'pages', 'indexCompra.html'));
}); 

app.get('/SobreNosotros', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'indexAboutUs.html'));
});

app.get('/Dialogo', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'Dialogo.html'));
});

app.get('/Cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'indexCart.html'));
});


// Ruta para enviar correo
app.post('/enviar-correo', async (req, res) => {
  const { nombre, email, telefono, asunto, mensaje } = req.body;

  if (!nombre || !email || !telefono || !asunto || !mensaje) {
    return res.status(400).json({ estado: 'error', mensaje: 'Faltan campos del formulario.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${nombre}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Mensaje de Contacto Luz de Azucar: ${asunto}`,
      text: `Nombre: ${nombre}
Teléfono: ${telefono}
Email: ${email}
Mensaje: ${mensaje}`,
      replyTo: email,
    });

    console.log('✅ Correo enviado:', info.messageId);
    res.json({ estado: 'exito', mensaje: 'Mensaje enviado con éxito.' });
  } catch (error) {
    console.error('❌ Error al enviar correo:', error.message);
    res.status(500).json({ estado: 'error', mensaje: 'Error al enviar el mensaje.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const livereload = await import('livereload');
  const connectLivereload = (await import('connect-livereload')).default;

  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch("src/views");

  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLivereload());
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});