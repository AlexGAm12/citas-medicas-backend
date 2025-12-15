import mongoose from "mongoose";
import Appointment from "../models/appointment.models.js";
import Doctor from "../models/doctor.models.js";
import Patient from "../models/patient.models.js";
import Availability from "../models/availability.models.js";

const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm).split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
  return h * 60 + m;
};

const pad2 = (n) => String(n).padStart(2, "0");
const toHHMM = (mins) => `${pad2(Math.floor(mins / 60))}:${pad2(mins % 60)}`;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const STATUS = ["pendiente", "confirmada", "cancelada", "finalizada"];

const ymdToDate = (ymd) => new Date(`${String(ymd)}T00:00:00.000Z`);

const dateToYMD = (d) => {
  if (!d) return "";
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
};

export const getAllAppointments = async (req, res) => {
  try {
    const list = await Appointment.find()
      .populate({
        path: "doctor",
        populate: [{ path: "user" }, { path: "specialty" }],
      })
      .populate({
        path: "patient",
        populate: [{ path: "user" }],
      })
      .populate("specialty")
      .sort({ date: -1, startTime: 1 });

    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: [error.message] });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user?.id;

    const [doc, pat] = await Promise.all([
      Doctor.findOne({ user: userId }),
      Patient.findOne({ user: userId }),
    ]);

    const query = {};
    if (doc) query.doctor = doc._id;
    else if (pat) query.patient = pat._id;
    else return res.status(404).json({ message: ["Perfil no encontrado"] });

    const list = await Appointment.find(query)
      .populate({
        path: "doctor",
        populate: [{ path: "user" }, { path: "specialty" }],
      })
      .populate({
        path: "patient",
        populate: [{ path: "user" }],
      })
      .populate("specialty")
      .sort({ date: -1, startTime: 1 });

    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: [error.message] });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: ["Id inválido"] });
    }
    if (!STATUS.includes(status)) {
      return res.status(400).json({
        message: [`Estado inválido. Usa: ${STATUS.join(", ")}`],
      });
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate({
        path: "doctor",
        populate: [{ path: "user" }, { path: "specialty" }],
      })
      .populate({
        path: "patient",
        populate: [{ path: "user" }],
      })
      .populate("specialty");

    if (!updated) {
      return res.status(404).json({ message: ["Cita no encontrada"] });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: [error.message] });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !isValidObjectId(doctorId)) {
      return res.status(400).json({ message: ["doctorId inválido"] });
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
      return res.status(400).json({ message: ["date inválida (YYYY-MM-DD)"] });
    }

    const avails = await Availability.find({
      doctor: doctorId,
      date: String(date),
      isActive: true,
    }).sort({ startTime: 1 });

    if (!avails.length) {
      return res.json({ slots: [] });
    }

    const dayStart = ymdToDate(date);
    const dayEnd = new Date(`${String(date)}T23:59:59.999Z`);

    const booked = await Appointment.find({
      doctor: doctorId,
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $in: ["pendiente", "confirmada"] },
    }).select("startTime endTime");

    const busy = new Set(booked.map((b) => `${b.startTime}-${b.endTime}`));

    const slots = [];

    for (const a of avails) {
      const startMin = toMinutes(a.startTime);
      const endMin = toMinutes(a.endTime);
      const step = Number(a.slotDuration);

      if (
        !Number.isFinite(startMin) ||
        !Number.isFinite(endMin) ||
        !Number.isFinite(step) ||
        step <= 0 ||
        endMin <= startMin
      ) {
        continue;
      }

      for (let t = startMin; t + step <= endMin; t += step) {
        const s = toHHMM(t);
        const e = toHHMM(t + step);
        const key = `${s}-${e}`;
        if (!busy.has(key)) slots.push({ startTime: s, endTime: e });
      }
    }

    return res.json({ slots });
  } catch (error) {
    return res.status(500).json({ message: [error.message] });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { doctor, patient, specialty, date, startTime, endTime, reason } =
      req.body;

    if (!doctor || !isValidObjectId(doctor)) {
      return res.status(400).json({ message: ["doctor inválido"] });
    }
    if (!patient || !isValidObjectId(patient)) {
      return res.status(400).json({ message: ["paciente inválido"] });
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
      return res.status(400).json({ message: ["date inválida (YYYY-MM-DD)"] });
    }
    if (!startTime || !/^\d{2}:\d{2}$/.test(String(startTime))) {
      return res.status(400).json({ message: ["startTime inválida (HH:MM)"] });
    }
    if (!endTime || !/^\d{2}:\d{2}$/.test(String(endTime))) {
      return res.status(400).json({ message: ["endTime inválida (HH:MM)"] });
    }

    const avails = await Availability.find({
      doctor,
      date: String(date),
      isActive: true,
    });

    if (!avails.length) {
      return res.status(400).json({
        message: ["No hay disponibilidad para esa fecha"],
      });
    }

    const slotStart = toMinutes(startTime);
    const slotEnd = toMinutes(endTime);

    const covered = avails.some((a) => {
      const aStart = toMinutes(a.startTime);
      const aEnd = toMinutes(a.endTime);
      return slotStart >= aStart && slotEnd <= aEnd;
    });

    if (!covered) {
      return res.status(400).json({
        message: ["Ese horario no está dentro de la disponibilidad del doctor"],
      });
    }

    const dayStart = ymdToDate(date);
    const dayEnd = new Date(`${String(date)}T23:59:59.999Z`);

    const exists = await Appointment.findOne({
      doctor,
      date: { $gte: dayStart, $lte: dayEnd },
      startTime: String(startTime),
      endTime: String(endTime),
      status: { $in: ["pendiente", "confirmada"] },
    });

    if (exists) {
      return res.status(400).json({ message: ["Esa cita ya está ocupada"] });
    }

    const appointment = await Appointment.create({
      doctor,
      patient,
      specialty: specialty || null,
      date: dayStart,
      startTime: String(startTime),
      endTime: String(endTime),
      reason: reason || "",
      status: "pendiente",
    });

    const populated = await Appointment.findById(appointment._id)
      .populate({
        path: "doctor",
        populate: [{ path: "user" }, { path: "specialty" }],
      })
      .populate({
        path: "patient",
        populate: [{ path: "user" }],
      })
      .populate("specialty");

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: [error.message] });
  }
};
