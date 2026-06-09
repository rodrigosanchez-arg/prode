const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Función auxiliar para generar el Token
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol, apodo: usuario.apodo },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // El token expira en 7 días
  );
};

// Registro de Usuario
exports.registrar = async (req, res) => {
  try {
    const { correo, apodo, password, nombre, apellido } = req.body;

    // Verificar si el correo o apodo ya existen
    const existeUsuario = await Usuario.findOne({ $or: [{ correo }, { apodo }] });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El correo o el apodo ya están registrados.' });
    }

    const nuevoUsuario = new Usuario({ correo, apodo, password, nombre, apellido });
    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      token,
      usuario: { id: nuevoUsuario._id, apodo: nuevoUsuario.apodo, correo: nuevoUsuario.correo }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de Usuario
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales inválidas (Correo no encontrado).' });
    }

    // Validar contraseña usando el método del Modelo
    const esPasswordValido = await usuario.compararPassword(password);
    if (!esPasswordValido) {
      return res.status(400).json({ error: 'Credenciales inválidas (Contraseña incorrecta).' });
    }

    const token = generarToken(usuario);

    res.status(200).json({
      token,
      usuario: { id: usuario._id, apodo: usuario.apodo, correo: usuario.correo, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};