import Doctor from "../models/doctor.models.js";
import User from "../models/user.models.js";
import Specialty from "../models/specialty.models.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("user", "username email")
      .populate("specialty", "name");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id)
      .populate("user", "username email")
      .populate("specialty", "name");

    if (!doctor) {
      return res.status(404).json({ message: ["Doctor no encontrado"] });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};
export const createDoctor = async (req, res) => {
  try {
    const { user, specialty, phone, bio, consultRoom } = req.body;

    const userFound = await User.findById(user);
    if (!userFound) {
      return res.status(400).json({ message: ["El usuario no existe"] });
    }

    const specialtyFound = await Specialty.findById(specialty);
    if (!specialtyFound) {
      return res.status(400).json({ message: ["La especialidad no existe"] });
    }

    const doctorExists = await Doctor.findOne({ user });
    if (doctorExists) {
      return res
        .status(400)
        .json({ message: ["Ese usuario ya tiene un perfil de doctor"] });
    }

    const doctor = await Doctor.create({
      user,
      specialty,
      phone,
      bio,
      consultRoom
    });

    const doctorPopulated = await Doctor.findById(doctor._id)
      .populate("user", "username email")
      .populate("specialty", "name");

    res.status(201).json(doctorPopulated);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, specialty, phone, bio, consultRoom } = req.body;

    if (user) {
      const userFound = await User.findById(user);
      if (!userFound) {
        return res.status(400).json({ message: ["El usuario no existe"] });
      }
    }

    if (specialty) {
      const specialtyFound = await Specialty.findById(specialty);
      if (!specialtyFound) {
        return res.status(400).json({ message: ["La especialidad no existe"] });
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { user, specialty, phone, bio, consultRoom },
      { new: true }
    )
      .populate("user", "username email")
      .populate("specialty", "name");

    if (!doctor) {
      return res.status(404).json({ message: ["Doctor no encontrado"] });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({ message: ["Doctor no encontrado"] });
    }

    res.json({ message: "Doctor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};
