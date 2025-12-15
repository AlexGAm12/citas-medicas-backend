import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import availabilityRoutes from "./routes/availability.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import userRoutes from "./routes/user.routes.js";
import specialtyRoutes from "./routes/specialty.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS bloqueado para origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ message: "API Citas Médicas funcionando" });
});

app.use("/api", userRoutes);
app.use("/api", specialtyRoutes);
app.use("/api", doctorRoutes);
app.use("/api", patientRoutes);

app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use("/api", reportsRoutes);

export default app;
