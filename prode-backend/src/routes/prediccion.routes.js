const express = require('express');
const router = express.Router();
const prediccionCtrl = require('../controllers/prediccion.controller');
const verificarAuth = require('../middlewares/auth.middleware.js');

router.post('/', verificarAuth, prediccionCtrl.guardarPrediccion);
router.get('/', prediccionCtrl.obtenerPredicciones);
router.get('/mis-predicciones',verificarAuth, prediccionCtrl.obtenerPrediccionesUsuario);

module.exports = router;