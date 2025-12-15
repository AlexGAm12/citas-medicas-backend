import Availability from "../models/availability.models.js";
import Doctor from "../models/doctor.models.js";

const toDayOfWeek = (ymd) => {
  const d = new Date(`${ymd}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? 0 : d.getUTCDay();
};

export const getMyAvailability = async (req, res) => {
  try {
    const userId = req.user.id;

    const doctor = await Doctor.findOne({ user: userId })
      .populate("user")
      .populate("specialty");

    if (!doctor) {
      return res.status(404).json({ message: ["No se encontró perfil de doctor"] });
    }

    const availability = await Availability.find({ doctor: doctor._id }).sort({
      date: 1,
      startTime: 1,
    });

    return res.json({ doctor, availability });
  } catch (error) {
    return res.status(500).json({ message: [error.message] });
  }
};

export const getAvailabilityByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const availability = await Availability.find({ doctor: doctorId }).sort({
      date: 1,
      startTime: 1,
    });

    return res.json({ availability });
  } catch (error) {
    return res.status(500).json({ message: [error.message] });
  }
};

export const createAvailability = async (req, res) => {
  try {
    const { doctor, date, startTime, endTime, slotDuration, isActive } = req.body;

    if (!doctor) return res.status(400).json({ message: ["Doctor requerido"] });
    if (!date) return res.status(400).json({ message: ["Fecha requerida (YYYY-MM-DD)"] });

    const dayOfWeek = toDayOfWeek(date);

    const created = await Availability.create({
      doctor,
      date,
      dayOfWeek,
      startTime,
      endTime,
      slotDuration: Number(slotDuration),
      isActive: isActive !== false,
    });

    return res.status(201).json(created);
  } catch (error) {
    // por index unique, manda mensaje más claro
    if (error?.code === 11000) {
      return res.status(400).json({ message: ["Ya existe esa disponibilidad"] });
    }
    return res.status(500).json({ message: [error.message] });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctor, date, startTime, endTime, slotDuration, isActive } = req.body;

    const dayOfWeek = date ? toDayOfWeek(date) : undefined;

    const updated = await Availability.findByIdAndUpdate(
      id,
      {
        ...(doctor ? { doctor } : {}),
        ...(date ? { date } : {}),
        ...(typeof dayOfWeek === "number" ? { dayOfWeek } : {}),
        ...(startTime ? { startTime } : {}),
        ...(endTime ? { endTime } : {}),
        ...(slotDuration ? { slotDuration: Number(slotDuration) } : {}),
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: ["Disponibilidad no encontrada"] });

    return res.json(updated);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: ["Ya existe esa disponibilidad"] });
    }
    return res.status(500).json({ message: [error.message] });
  }
};

export const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Availability.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: ["Disponibilidad no encontrada"] });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: [error.message] });
  }
};
