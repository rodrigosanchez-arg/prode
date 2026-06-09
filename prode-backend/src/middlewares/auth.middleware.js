const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Espera formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado; // Guarda los datos del token decodificado en el request
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token no válido o expirado.' });
  }
};