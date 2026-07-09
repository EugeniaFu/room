import prisma from '../../config/prisma.js';
import bcrypt from 'bcrypt';

import {
  sendVerificationCodeEmail,
  sendPasswordResetEmail,
} from '../../config/mailer.js';

// Toda cuenta nueva es, a la vez, arrendador y arrendatario:
// una misma persona puede rentar un espacio y también buscar
// compartir el suyo, sin necesidad de crear otra cuenta.
const DEFAULT_SIGNUP_ROLES = ['roomie', 'host'];

const CODE_EXPIRATION_MINUTES = 15;

export const validatePasswordStrength = (password) => {

  if (!password || password.length < 8) {

    throw new Error(
      'La contraseña debe tener al menos 8 caracteres'
    );
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {

    throw new Error(
      'La contraseña debe incluir al menos una letra y un número'
    );
  }
};

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createVerificationCode = async (userId, type) => {

  const code = generateCode();

  const expiresAt = new Date(
    Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000
  );

  await prisma.verificationCode.create({
    data: {
      userId,
      code,
      type,
      expiresAt,
    },
  });

  return code;
};

const consumeVerificationCode = async (userId, code, type) => {

  const record = await prisma.verificationCode.findFirst({

    where: {
      userId,
      code,
      type,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },

    orderBy: { createdAt: 'desc' },
  });

  if (!record) {

    throw new Error(
      'Código inválido o expirado'
    );
  }

  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });
};

export const register = async ({
  name,
  email,
  phone,
  password
}) => {

  validatePasswordStrength(password);

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

  // Buscar los roles base (se siembran solos la primera vez)
  let roleRecords = await prisma.role.findMany({

    where: {
      name: {
        in: DEFAULT_SIGNUP_ROLES
      }
    }

  });

  if (roleRecords.length !== DEFAULT_SIGNUP_ROLES.length) {

    await prisma.role.createMany({
      data: DEFAULT_SIGNUP_ROLES.map((name) => ({ name })),
      skipDuplicates: true
    });

    roleRecords = await prisma.role.findMany({
      where: {
        name: {
          in: DEFAULT_SIGNUP_ROLES
        }
      }
    });
  }

  const user = await prisma.user.create({

    data: {

      email,

      password: hashedPassword,

      // la cuenta queda inactiva hasta confirmar el código
      // que se manda al correo
      isActive: false,

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

  const code = await createVerificationCode(
    user.id,
    'EMAIL_CONFIRMATION'
  );

  await sendVerificationCodeEmail(email, code);

  return user;
};

export const resendVerificationCode = async (email) => {

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Usuario no existe');
  }

  if (user.isActive) {
    throw new Error('Esta cuenta ya está confirmada');
  }

  const code = await createVerificationCode(
    user.id,
    'EMAIL_CONFIRMATION'
  );

  await sendVerificationCodeEmail(email, code);
};

export const verifyEmail = async (email, code) => {

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: { include: { role: true } },
    },
  });

  if (!user) {
    throw new Error('Usuario no existe');
  }

  if (user.isActive) {
    return user;
  }

  await consumeVerificationCode(
    user.id,
    code,
    'EMAIL_CONFIRMATION'
  );

  return prisma.user.update({
    where: { id: user.id },
    data: { isActive: true },
    include: {
      roles: { include: { role: true } },
    },
  });
};

export const forgotPassword = async (email) => {

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // No revelamos si el correo existe o no, para evitar
  // que se use este endpoint para enumerar cuentas.
  if (!user) {
    return;
  }

  const code = await createVerificationCode(
    user.id,
    'PASSWORD_RESET'
  );

  await sendPasswordResetEmail(email, code);
};

export const resetPassword = async (
  email,
  code,
  newPassword
) => {

  validatePasswordStrength(newPassword);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Código inválido o expirado');
  }

  await consumeVerificationCode(
    user.id,
    code,
    'PASSWORD_RESET'
  );

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
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

  if (!user.isActive) {

    throw new Error(
      'Debes confirmar tu correo antes de iniciar sesión'
    );
  }

  return user;
};
