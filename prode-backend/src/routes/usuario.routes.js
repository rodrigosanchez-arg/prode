const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuario.controller');

router.post('/', usuarioCtrl.crearUsuario);
router.get('/ranking', usuarioCtrl.obtenerRanking);

module.exports = router;