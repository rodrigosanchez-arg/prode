const Usuario = require('../models/Usuario');

exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerRanking = async (req, res) => {
  try {
    const ranking = await Usuario.find().sort({ puntos: -1 }).select('-password');
    res.status(200).json(ranking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};