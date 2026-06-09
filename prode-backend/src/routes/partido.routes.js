const express = require('express');
const router = express.Router();
const partidoCtrl = require('../controllers/partido.controller');

router.post('/', partidoCtrl.crearPartido);
router.get('/', partidoCtrl.obtenerPartidos);

module.exports = router;