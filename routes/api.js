const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Middleware para manejar errores
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Obtener todas las categorías
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = Object.keys(req.waifus || {});
  res.json({
    success: true,
    count: categories.length,
    data: categories
  });
}));

// Obtener todas las imágenes de una categoría
router.get('/categories/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 10, offset = 0 } = req.query;
  
  if (!req.waifus[category]) {
    return res.status(404).json({
      success: false,
      message: 'Categoría no encontrada'
    });
  }

  const waifus = req.waifus[category];
  const paginatedWaifus = waifus.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    success: true,
    count: paginatedWaifus.length,
    total: waifus.length,
    data: paginatedWaifus.map(waifu => ({
      ...waifu,
      image: `${req.protocol}://${req.get('host')}${waifu.image}`
    }))
  });
}));

// Obtener una imagen aleatoria
router.get('/random', asyncHandler(async (req, res) => {
  const { category } = req.query;
  let waifus = [];

  if (category) {
    if (!req.waifus[category]) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    waifus = req.waifus[category];
  } else {
    // Aplanar todas las categorías en un solo array
    waifus = Object.values(req.waifus).flat();
  }

  if (waifus.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No hay imágenes disponibles'
    });
  }

  const randomWaifu = waifus[Math.floor(Math.random() * waifus.length)];
  
  res.json({
    success: true,
    data: {
      ...randomWaifu,
      image: `${req.protocol}://${req.get('host')}${randomWaifu.image}`
    }
  });
}));

// Buscar imágenes
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Parámetro de búsqueda (q) es requerido'
    });
  }

  const results = [];
  const searchTerm = q.toLowerCase();

  for (const category in req.waifus) {
    const matchingWaifus = req.waifus[category].filter(waifu => 
      waifu.name.toLowerCase().includes(searchTerm) ||
      category.toLowerCase().includes(searchTerm)
    );
    
    results.push(...matchingWaifus);
  }

  res.json({
    success: true,
    count: results.length,
    data: results.map(waifu => ({
      ...waifu,
      image: `${req.protocol}://${req.get('host')}${waifu.image}`
    }))
  });
}));

// Obtener metadatos de la API
router.get('/info', (req, res) => {
  let totalImages = 0;
  const categories = [];
  
  for (const [category, waifus] of Object.entries(req.waifus)) {
    const count = waifus.length;
    totalImages += count;
    categories.push({
      name: category,
      count: count
    });
  }

  res.json({
    success: true,
    data: {
      name: 'Waifus-wa API',
      version: '1.0.0',
      totalImages,
      totalCategories: categories.length,
      categories
    }
  });
});

module.exports = router;
