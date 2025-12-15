import User from "../models/user.models.js";

export const isPatientOrAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userFound = await User.findById(userId).populate("role");
    if (!userFound) {
      return res.status(404).json({ message: ["Usuario no encontrado"] });
    }

    const roleName = userFound.role.role;
    const adminRoleEnv = process.env.SETUP_ROLE_ADMIN || "admin";
    const patientRoleEnv = process.env.SETUP_ROLE_PACIENTE || "paciente";

    if (roleName !== adminRoleEnv && roleName !== patientRoleEnv) {
      return res
        .status(401)
        .json({ message: ["No autorizado, se requiere rol paciente o admin"] });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [error.message] });
  }
};
