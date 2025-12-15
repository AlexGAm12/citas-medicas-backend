import User from "../models/user.models.js";
import Role from "../models/roles.models.js";

export const isDoctorOrAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userFound = await User.findById(userId).populate("role");
    if (!userFound) {
      return res.status(404).json({ message: ["Usuario no encontrado"] });
    }

    const roleName = userFound.role.role;
    const adminRoleEnv = process.env.SETUP_ROLE_ADMIN || "admin";
    const doctorRoleEnv = process.env.SETUP_ROLE_DOCTOR || "doctor";

    if (roleName !== adminRoleEnv && roleName !== doctorRoleEnv) {
      return res
        .status(401)
        .json({ message: ["No autorizado, se requiere rol doctor o admin"] });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [error.message] });
  }
};
