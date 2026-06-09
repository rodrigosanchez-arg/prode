const mongoose = require('mongoose');

const PrediccionSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  partido_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Partido', required: true },
  goles_local_predicho: { type: Number, required: true },
  goles_visitante_predicho: { type: Number, required: true },
  puntos_ganados: { type: Number, default: 0 }
}, { timestamps: true });

// Índice compuesto para evitar que un usuario tenga más de una predicción por partido
PrediccionSchema.index({ usuario_id: 1, partido_id: 1 }, { unique: true });

module.exports = mongoose.model('Prediccion', PrediccionSchema);
