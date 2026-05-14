import prisma from '../../config/prisma.js';
import bcrypt from 'bcrypt';

export const register = async ({
  name,
  email,
  phone,
  password,
 roles
}) => {

  const requestedRoles = [...new Set(roles || [])];

  if (requestedRoles.length === 0) {
    throw new Error('Selecciona al menos un rol');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('El correo ya existe');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  // Buscar roles seleccionados
  let roleRecords = await prisma.role.findMany({

    where: {
      name: {
        in: requestedRoles
      }
    }

  });

  // Si faltan roles válidos base, los crea automáticamente.
  if (roleRecords.length !== requestedRoles.length) {

    const allowedRoles = ['roomie', 'host', 'admin'];

    const missingRoles = requestedRoles.filter(
      (role) => !roleRecords.some((record) => record.name === role)
    );

    const invalidRoles = missingRoles.filter(
      (role) => !allowedRoles.includes(role)
    );

    if (invalidRoles.length > 0) {
      throw new Error('Roles inválidos');
    }

    if (missingRoles.length > 0) {
      await prisma.role.createMany({
        data: missingRoles.map((name) => ({ name })),
        skipDuplicates: true
      });

      roleRecords = await prisma.role.findMany({
        where: {
          name: {
            in: requestedRoles
          }
        }
      });
    }
  }

  if (roleRecords.length === 0) {
    throw new Error('Roles inválidos');
  }

  const user = await prisma.user.create({

    data: {

      email,

      password: hashedPassword,

      profile: {
        create: {
          name
        }
      },

      roles: {

        create: roleRecords.map(role => ({

          role: {
            connect: {
              id: role.id
            }
          }

        }))
      }
    },

    include: {

      profile: true,

      roles: {
        include: {
          role: true
        }
      }
    }
  });

  return user;
};

export const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('Usuario no existe');
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error('Contraseña incorrecta');
  }

  return user;
};