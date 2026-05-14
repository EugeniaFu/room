import prisma from '../../config/prisma.js';
import bcrypt from 'bcrypt';

export const register = async ({
  name,
  email,
  phone,
  password,
 roles
}) => {

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
  const roleRecords = await prisma.role.findMany({

    where: {
      name: {
        in: roles
      }
    }

  });

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