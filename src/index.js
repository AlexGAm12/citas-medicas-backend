import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db.js";
import { initializeSetup } from "./libs/initialSetup.js";

const PORT = process.env.PORT || 10000;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const startServer = async () => {
  try {
    await connectDB();
    await initializeSetup();

    app.listen(PORT, () => {
      console.log("Servidor escuchando en el puerto %d", PORT);
    });
  } catch (error) {
    console.error("Error iniciando servidor:", error);
    process.exit(1);
  }
};

startServer();
