import Specialty from "../models/specialty.models.js";

export const getSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find().sort({ name: 1 });
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const createSpecialty = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exists = await Specialty.findOne({ name });
    if (exists) {
      return res
        .status(400)
        .json({ message: ["Ya existe una especialidad con ese nombre"] });
    }

    const specialty = await Specialty.create({ name, description });
    res.status(201).json(specialty);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const updateSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const specialty = await Specialty.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!specialty) {
      return res
        .status(404)
        .json({ message: ["Especialidad no encontrada"] });
    }

    res.json(specialty);
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const deleteSpecialty = async (req, res) => {
  try {
    const { id } = req.params;

    const specialty = await Specialty.findByIdAndDelete(id);

    if (!specialty) {
      return res
        .status(404)
        .json({ message: ["Especialidad no encontrada"] });
    }

    res.json({ message: "Especialidad eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};
