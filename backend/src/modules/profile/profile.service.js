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
        include: {
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
      user: true
    }
  });

  return profile;
};