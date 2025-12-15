import User from "../models/user.models.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("role", "role");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener usuarios"
    });
  }
};
