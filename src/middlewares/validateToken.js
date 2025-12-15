import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: ["No token, autorización denegada"] });
    }

    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: ["Token inválido"] });
      }

      const id = decoded?.id || decoded?._id || decoded?.userId;

      if (!id) {
        return res.status(401).json({ message: ["Token inválido (sin id)"] });
      }

      req.user = { ...decoded, id };
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: ["No autorizado"] });
  }
};
