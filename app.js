const fs = require('fs');
const express = require('express');
const path = require('path');

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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

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

app.use('/', homeRoutes);
app.use('/upload', uploadRoutes);

// Configuración del puerto
app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});
