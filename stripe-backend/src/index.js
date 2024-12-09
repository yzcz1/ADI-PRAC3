import express from 'express';
import cors from 'cors'; // Importar cors
import paymentRoutes from './routes/payment.routes.js';
import { PORT } from './routes/config.js';
import path from 'path';

const app = express();

// Configurar CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Permitir solicitudes desde el frontend
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Configuración de rutas
app.use(paymentRoutes);

// Servir archivos estáticos
app.use(express.static(path.resolve('src/public')));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log('Server on port', PORT);
});
