const express = require('express');
const cors = require('cors');

const app = express();

// Habilitar CORS
app.use(cors());

// Definir tus rutas aquí

// Iniciar el servidor
app.listen(9191, () => {
  console.log('Servidor iniciado en el puerto 9191');
});
