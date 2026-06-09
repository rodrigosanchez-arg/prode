const Partido = require('../models/Partido');

// Asegúrate de que diga "exports.crearPartido"
exports.crearPartido = async (req, res) => {
  try {
    // Si viene un array, usa insertMany, si viene un objeto único, usa create/save
    const resultado = Array.isArray(req.body) 
      ? await Partido.insertMany(req.body) 
      : await new Partido(req.body).save();
      
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.obtenerPartidos = async (req, res) => {
  try {
    const partidos = await Partido.find().sort({ fecha_hora: 1 });
    res.status(200).json(partidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};