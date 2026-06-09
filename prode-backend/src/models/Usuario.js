const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  apodo: { type: String, required: true, unique: true },
  correo: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  pagado: { type: Boolean, default: false },
  puntos: { type: Number, default: 0 },
  rol: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// Middleware de Mongoose: Encriptar contraseña antes de guardar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas en el Login
UsuarioSchema.methods.compararPassword = async function (passwordCandidata) {
  return await bcrypt.compare(passwordCandidata, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);