export const validateSchema = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const msgs = result.error.issues.map((i) => i.message);
      return res.status(400).json({ message: msgs });
    }
    req.body = result.data;
    next();
  } catch (e) {
    return res.status(500).json({ message: [e.message] });
  }
};
