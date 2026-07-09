import prisma from '../../config/prisma.js';

export const createProfile = async (userId, data) => {

  const existingProfile = await prisma.profile.findUnique({
    where: {
      userId
    }
  });

  if (existingProfile) {
    throw new Error('El perfil ya existe');
  }

  const profile = await prisma.profile.create({
    data: {
      userId,
      name: data.name,
      bio: data.bio,
      age: data.age,
      gender: data.gender,
      university: data.university,
      avatarUrl: data.avatarUrl,
    }
  });

  return profile;
};

export const getMyProfile = async (userId) => {

  const profile = await prisma.profile.findUnique({
    where: {
      userId
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          verificationStatus: true,
          verifiedAt: true,
          roles: {
            include: {
              role: true
            }
          }
        }
      }
    }
  });

  return profile;
};

export const updateProfile = async (userId, data) => {

  const profile = await prisma.profile.update({
    where: {
      userId
    },
    data: {
      name: data.name,
      bio: data.bio,
      age: data.age,
      gender: data.gender,
      university: data.university,
      avatarUrl: data.avatarUrl,
    }
  });

  return profile;
};

export const getProfileById = async (id) => {

  const profile = await prisma.profile.findUnique({
    where: {
      id
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          verificationStatus: true,
        }
      }
    }
  });

  return profile;
};

//////////////////////
// VERIFICACIÓN DE DOCUMENTOS
//////////////////////

export const uploadDocument = async (
  userId,
  type,
  url
) => {

  const document = await prisma.document.upsert({

    where: {
      userId_type: {
        userId,
        type,
      },
    },

    update: {
      url,
      status: 'PENDING',
    },

    create: {
      userId,
      type,
      url,
      status: 'PENDING',
    },
  });

  // un documento nuevo/reemplazado vuelve a poner
  // la cuenta en revisión si ya había sido evaluada
  await prisma.user.update({
    where: { id: userId },
    data: { verificationStatus: 'PENDING' },
  });

  return document;
};

export const getMyDocuments = async (userId) => {

  return prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPendingVerifications = async () => {

  return prisma.user.findMany({

    where: {
      verificationStatus: 'PENDING',
    },

    select: {
      id: true,
      email: true,
      createdAt: true,
      verificationStatus: true,
      profile: true,
      documents: true,
    },

    orderBy: {
      createdAt: 'asc',
    },
  });
};

export const reviewVerification = async (
  adminId,
  userId,
  decision, // 'APPROVED' | 'REJECTED'
  notes
) => {

  if (
    decision !== 'APPROVED' &&
    decision !== 'REJECTED'
  ) {

    throw new Error('Decisión inválida');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  await prisma.document.updateMany({
    where: { userId },
    data: { status: decision },
  });

  await prisma.verificationReview.create({
    data: {
      userId,
      adminId,
      status: decision,
      notes,
    },
  });

  return prisma.user.update({
    where: { id: userId },
    data: {
      verificationStatus: decision,
      verifiedAt: decision === 'APPROVED' ? new Date() : null,
    },
  });
};