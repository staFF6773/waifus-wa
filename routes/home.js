const express = require('express');
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
  // Limitar las imágenes a 10 por categoría
  const limitedCategories = {};
  for (const category in req.waifus) {
    limitedCategories[category] = req.waifus[category].slice(0, 10);
  }
  res.render('home', { limitedCategories });
});

// Ruta para una categoría específica
router.get('/category/:category', (req, res) => {
  const { category } = req.params;

  // Obtener las waifus de la categoría seleccionada
  const filteredWaifus = req.waifus[category] || [];
  res.render('category', { category, waifus: filteredWaifus });
});

// Ruta para la página de política de privacidad
router.get('/Privacy', (req, res) => {
  res.render('privacy-policy');
});

module.exports = router;
