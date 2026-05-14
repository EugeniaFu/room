import prisma from '../../config/prisma.js';

const calculateCompatibility =
  (currentUser, targetUser) => {

    let score = 0;

    // Ciudad
    if (
      currentUser.profile?.city &&
      targetUser.profile?.city &&
      currentUser.profile.city ===
      targetUser.profile.city
    ) {
      score += 20;
    }

    // Universidad
    if (
      currentUser.profile?.university &&
      targetUser.profile?.university &&
      currentUser.profile.university ===
      targetUser.profile.university
    ) {
      score += 20;
    }

    // Fumar
    if (
      currentUser.profile?.smokes ===
      targetUser.profile?.smokes
    ) {
      score += 15;
    }

    // Mascotas
    if (
      currentUser.profile?.pets ===
      targetUser.profile?.pets
    ) {
      score += 15;
    }

    // Horario sueño
    if (
      currentUser.profile?.sleepSchedule &&
      targetUser.profile?.sleepSchedule &&
      currentUser.profile.sleepSchedule ===
      targetUser.profile.sleepSchedule
    ) {
      score += 10;
    }

    // Presupuesto
    if (
      currentUser.preferences &&
      targetUser.preferences
    ) {

      const compatible =
        currentUser.preferences.budgetMax >=
        targetUser.preferences.budgetMin;

      if (compatible) {
        score += 20;
      }
    }

    return Math.min(score, 100);
  };

export const discoverUsers =
  async (currentUserId) => {

    // Usuario actual
    const currentUser =
      await prisma.user.findUnique({

        where: {
          id: currentUserId,
        },

        include: {
          profile: true,
          preferences: true,
        },
      });

    if (!currentUser) {
      throw new Error(
        'Usuario no encontrado'
      );
    }

    // Usuarios candidatos
    const users =
      await prisma.user.findMany({

        where: {

          id: {
            not: currentUserId,
          },

          profile: {
            isNot: null,
          },

          isActive: true,
        },

        include: {
          profile: true,
          preferences: true,
        },

        take: 50,
      });

    // Compatibilidad
    const usersWithScore =
      users.map((user) => {

        const compatibility =
          calculateCompatibility(
            currentUser,
            user
          );

        return {
          ...user,
          compatibility,
        };
      });

    // Ordenar
    usersWithScore.sort(
      (a, b) =>
        b.compatibility -
        a.compatibility
    );

    return usersWithScore;
  };

