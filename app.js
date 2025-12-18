const fs = require('fs');
const express = require('express');
const path = require('path');
const cors = require('cors');

// Crear la carpeta 'data' si no existe
const dataDir = './data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('La carpeta "data" ha sido creada.');
}

// Crear la carpeta 'uploads' en 'public' si no existe
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('La carpeta "uploads" ha sido creada.');
}

// Ruta para el archivo JSON que guarda las waifus
const waifusFilePath = path.join(dataDir, 'waifus.json');

// Inicializar Express
const app = express();

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Middleware para cargar y guardar waifus en el archivo JSON
function loadWaifus() {
  if (fs.existsSync(waifusFilePath)) {
    const waifusData = fs.readFileSync(waifusFilePath);
    return JSON.parse(waifusData);
  } else {
    return {}; // Si no existe el archivo, devolver un objeto vacío
  }
}

function saveWaifus(waifus) {
  fs.writeFileSync(waifusFilePath, JSON.stringify(waifus, null, 2));
}

// Pasar funciones de carga y guardado a las rutas
app.use((req, res, next) => {
  req.loadWaifus = loadWaifus;
  req.saveWaifus = saveWaifus;
  req.waifus = loadWaifus(); // Cargar waifus en cada petición
  next();
});

// Importar y usar rutas
const homeRoutes = require('./routes/home');
const uploadRoutes = require('./routes/upload');
const apiRoutes = require('./routes/api');

// Rutas de la API
app.use('/api', apiRoutes);

// Rutas de la aplicación web
app.use('/', homeRoutes);
app.use('/upload', uploadRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Ruta no encontrada
app.use((req, res) => {
  if (req.accepts('json')) {
    return res.status(404).json({ 
      success: false, 
      message: 'Ruta no encontrada' 
    });
  }
  res.status(404).send('Ruta no encontrada');
});

// Configuración del puerto
app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});
