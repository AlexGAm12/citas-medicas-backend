import User from "../models/user.models.js";
import Role from "../models/roles.models.js";

export const isAdmin = async (req, res, next) => {
  try {
    // req.user viene del token (authRequired)
    const userId = req.user.id;

    const userFound = await User.findById(userId).populate("role");
    if (!userFound) {
      return res.status(404).json({ message: ["Usuario no encontrado"] });
    }

    const roleName = userFound.role.role;

    // Comparamos contra el rol admin definido en .env
    const adminRoleEnv = process.env.SETUP_ROLE_ADMIN || "admin";

    if (roleName !== adminRoleEnv) {
      return res.status(401).json({ message: ["No autorizado, se requiere rol admin"] });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: [error.message] });
  }
};
