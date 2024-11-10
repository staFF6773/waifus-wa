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
    const imageFormat = req.file.mimetype.split('/')[1]; // Obtener el formato de la imagen (jpg, png, gif, etc.)

    let outputImageBuffer;
    const dateUtc = new Date().toISOString().replace(/:/g, '-');
    let imageName = `waifu-${dateUtc}`; // Cambiado a 'let' para permitir la reasignación

    if (imageFormat === 'gif') {
      // Si la imagen es un GIF, la guardamos como GIF
      outputImageBuffer = req.file.buffer;
      imageName += '.gif';
    } else {
      // Convertir la imagen a WebP
      outputImageBuffer = await sharp(req.file.buffer).webp().toBuffer();
      imageName += '.webp';
    }

    const outputPath = path.join(categoryDir, imageName);
    await sharp(outputImageBuffer).toFile(outputPath);

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
