import Patient from "../models/patient.models.js";
import User from "../models/user.models.js";

export const getMyPatientProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: ["No autorizado"] });
    }

    const patient = await Patient.findOne({ user: userId }).populate(
      "user",
      "username email"
    );

    if (!patient) {
      return res.status(404).json({
        message: ["No se encontró perfil de paciente para este usuario"],
      });
    }

    return res.json(patient);
  } catch (error) {
    return res.status(500).json({ message: [error.message] });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("user", "username email");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id).populate("user", "username email");

    if (!patient) {
      return res.status(404).json({ message: ["Paciente no encontrado"] });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const createPatient = async (req, res) => {
  try {
    const { user, phone, dateOfBirth, gender, allergies, notes } = req.body;

    const userFound = await User.findById(user);
    if (!userFound) {
      return res.status(400).json({ message: ["El usuario no existe"] });
    }

    const exists = await Patient.findOne({ user });
    if (exists) {
      return res
        .status(400)
        .json({ message: ["Ese usuario ya tiene un perfil de paciente"] });
    }

    const patient = await Patient.create({
      user,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      allergies,
      notes,
    });

    const patientPopulated = await Patient.findById(patient._id).populate(
      "user",
      "username email"
    );

    res.status(201).json(patientPopulated);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, phone, dateOfBirth, gender, allergies, notes } = req.body;

    if (user) {
      const userFound = await User.findById(user);
      if (!userFound) {
        return res.status(400).json({ message: ["El usuario no existe"] });
      }
    }

    const updatedData = {
      user,
      phone,
      gender,
      allergies,
      notes,
    };

    if (dateOfBirth) {
      updatedData.dateOfBirth = new Date(dateOfBirth);
    }

    const patient = await Patient.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).populate("user", "username email");

    if (!patient) {
      return res.status(404).json({ message: ["Paciente no encontrado"] });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({ message: ["Paciente no encontrado"] });
    }

    res.json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};
