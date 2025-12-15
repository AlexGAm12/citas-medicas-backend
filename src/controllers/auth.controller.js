import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import Role from "../models/roles.models.js";
import Doctor from "../models/doctor.models.js";
import Patient from "../models/patient.models.js";
import { createAccessToken } from "../libs/jwt.js";

const isProd = process.env.ENVIRONMENT === "production";

export const register = async (req, res) => {
  try {
    let { username, email, password, role } = req.body;

    role = String(role || "").trim().toLowerCase();

    const allowed = ["paciente", "doctor", "admin"];
    if (!allowed.includes(role)) {
      return res.status(400).json({ message: ["Rol no válido"] });
    }

    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message: ["El email ya está registrado"] });
    }

    const roleFound = await Role.findOne({ role });
    if (!roleFound) {
      return res.status(500).json({ message: [`El rol '${role}' no existe en BD`] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userSaved = await new User({
      username,
      email,
      password: hashedPassword,
      role: roleFound._id,
    }).save();

    if (role === "doctor") {
      await Doctor.findOneAndUpdate(
        { user: userSaved._id },
        { user: userSaved._id, specialty: null, phone: "", bio: "", consultRoom: "" },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    if (role === "paciente") {
      await Patient.findOneAndUpdate(
        { user: userSaved._id },
        { user: userSaved._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      role,
    });
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email }).populate("role");
    if (!userFound) {
      return res.status(400).json({ message: ["Usuario no encontrado"] });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: ["Contraseña incorrecta"] });
    }

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role.role,
    });
  } catch (error) {
    res.status(500).json({ message: [error.message] });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.json({ message: "Sesión cerrada" });
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id).populate("role");
  if (!userFound) {
    return res.status(400).json({ message: ["Usuario no encontrado"] });
  }

  res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    role: userFound.role.role,
  });
};
