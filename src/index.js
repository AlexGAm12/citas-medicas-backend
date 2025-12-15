import 'dotenv/config';
import app from './app.js';
import { connectDB } from './db.js';
import { initializeSetup } from './libs/initialSetup.js';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();
  await initializeSetup();

  app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto %d', PORT);
  });
  
};

startServer();
