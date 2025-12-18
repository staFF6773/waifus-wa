const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuración de almacenamiento de multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('waifuImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No se ha subido ninguna imagen.');
    }

    const category = req.body.category;
    const validCategories = ['waifu', 'neko', 'manga', 'happy', 'dance', 'hug', 'other'];

    if (!validCategories.includes(category)) {
      return res.status(400).send('Categoría no válida.');
    }

    // Crear la carpeta para la categoría si no existe
    const categoryDir = path.join(__dirname, '..', 'public', 'uploads', category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
      console.log(`La carpeta "${category}" ha sido creada.`);
    }

    // Verificar si la imagen es un GIF
    const isGif = req.file.mimetype === 'image/gif';
    const dateUtc = new Date().toISOString().replace(/:/g, '-');
    const imageName = `waifu-${dateUtc}.${isGif ? 'gif' : 'jpeg'}`;
    const outputPath = path.join(categoryDir, imageName);

    if (isGif) {
      // Si es un GIF, guardar directamente sin procesar para mantener la animación
      fs.writeFileSync(outputPath, req.file.buffer);
    } else {
      // Si no es un GIF, redimensionar y optimizar con sharp
      await sharp(req.file.buffer)
        .resize(800, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({
          quality: 85,
          progressive: true
        })
        .toFile(outputPath);
    }

    // Crear el objeto de waifu
    const newWaifu = {
      name: `Waifu ${dateUtc}`,
      image: `/uploads/${category}/${imageName}`,
      category: category
    };

    // Añadir la nueva waifu a la categoría correspondiente
    if (!req.waifus[category]) {
      req.waifus[category] = [];
    }
    req.waifus[category].push(newWaifu);

    // Guardar las waifus actualizadas en el archivo JSON
    req.saveWaifus(req.waifus);

    res.redirect('/');
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).send('Error al procesar la imagen.');
  }
});

module.exports = router;
