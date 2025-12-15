import bcrypt from 'bcryptjs';
import Role from '../models/roles.models.js';
import User from '../models/user.models.js';

export const initializeSetup = async () => {
  const rolesToCreate = [
    process.env.SETUP_ROLE_ADMIN || 'admin',
    process.env.SETUP_ROLE_DOCTOR || 'doctor',
    process.env.SETUP_ROLE_PACIENTE || 'paciente'
  ];

  for (const roleName of rolesToCreate) {
    const exists = await Role.findOne({ role: roleName });
    if (!exists) {
      await Role.create({ role: roleName });
      console.log(`>>> Rol creado: ${roleName}`);
    }
  }

  const adminEmail = process.env.SETUP_ADMIN_EMAIL || 'admin@citas.com';
  const admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    const adminRole = await Role.findOne({
      role: process.env.SETUP_ROLE_ADMIN || 'admin'
    });

    const hashedPwd = await bcrypt.hash(
      process.env.SETUP_ADMIN_PWD || 'admin123',
      10
    );

    await User.create({
      username: process.env.SETUP_ADMIN_USERNAME || 'admin',
      email: adminEmail,
      password: hashedPwd,
      role: adminRole._id
    });

    console.log('Usuario administrador creado');
  }
};
