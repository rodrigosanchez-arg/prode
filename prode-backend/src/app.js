const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuario.routes');
const partidoRoutes = require('./routes/partido.routes');
const prediccionRoutes = require('./routes/prediccion.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares globales
//app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Registro de rutas
app.use('/api/auth', authRoutes); // <- NUEVA RUTA PARA LOGUEARSE/REGISTRARSE
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/partidos', partidoRoutes);
app.use('/api/predicciones', prediccionRoutes);

module.exports = app;
