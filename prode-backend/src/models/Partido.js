const mongoose = require('mongoose');

const PartidoSchema = new mongoose.Schema({
  equipo_local: { type: String, required: true }, // Simplificado a String para nombres de países
  equipo_visitante: { type: String, required: true },
  fecha_hora: { type: Date, required: true },
  fase: { type: String, enum: ['Grupos', 'Octavos', 'Cuartos', 'Semifinal', 'Final'], required: true },
  goles_local: { type: Number, default: null },
  goles_visitante: { type: Number, default: null },
  estado: { type: String, enum: ['Pendiente', 'En Progreso', 'Finalizado'], default: 'Pendiente' },
  grupo:{ type: String},
}, { timestamps: true });

module.exports = mongoose.model('Partido', PartidoSchema);