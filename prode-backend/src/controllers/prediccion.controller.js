const Prediccion = require('../models/Prediccion');
const Partido = require('../models/Partido');

exports.guardarPrediccion = async (req, res) => {
  try {
    // 1. Desestructuramos los goles y el partido del BODY
    const { partido_id, goles_local_predicho, goles_visitante_predicho } = req.body;
    
    // 2. Extraemos de forma SEGURA el usuario_id desde el middleware de autenticación (req.usuario)
    const usuario_id = req.usuario.id; 

    console.log("ID del usuario autenticado:", usuario_id); // Ahora sí va a mostrar el ObjectId correcto

    // Verificar si el partido existe
    const partido = await Partido.findById(partido_id);
    if (!partido) return res.status(404).json({ error: 'Partido no encontrado' });
    
    // Verificar que el partido no haya empezado
    if (new Date() >= new Date(partido.fecha_hora)) {
      return res.status(400).json({ error: 'El partido ya ha comenzado. No se permiten predicciones.' });
    }

    // Guardar o actualizar (Upsert) usando el usuario_id del token
    const prediccion = await Prediccion.findOneAndUpdate(
      { usuario_id, partido_id },
      { goles_local_predicho, goles_visitante_predicho },
      { new: true, upsert: true }
    );

    res.status(200).json(prediccion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ... (Aquí se mantiene tu función guardarPrediccion ya existente) ...

// NUEVA FUNCIÓN: Obtener predicciones del usuario autenticado
exports.obtenerPrediccionesUsuario = async (req, res) => {
  try {
    // req.usuario.id viene inyectado de forma segura desde el middleware auth.middleware.js
    const usuarioId = req.usuario.id; 

    // Buscamos las predicciones y con .populate('partido_id') adjuntamos los datos del partido
    const predicciones = await Prediccion.find({ usuario_id: usuarioId })
      .populate({
        path: 'partido_id',
        select: 'equipo_local equipo_visitante fecha_hora fase grupo estado goles_local goles_visitante'
      })
      .sort({ createdAt: -1 }); // Las ordena mostrando las más recientes primero

    res.status(200).json(predicciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.obtenerPredicciones = async (req, res) => {
  try {

    // Buscamos las predicciones y con .populate('partido_id') adjuntamos los datos del partido
    const predicciones = await Prediccion.find({})
      .populate({
        path: 'partido_id',
        select: 'equipo_local equipo_visitante fecha_hora fase grupo estado goles_local goles_visitante'
      })
      .sort({ createdAt: -1 }); // Las ordena mostrando las más recientes primero

    res.status(200).json(predicciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};