import prisma from '../../config/prisma.js';

export const getPotentialMatches =
  async (currentUserId) => {

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

    // Likes enviados
    const sentRequests =
      await prisma.connectionRequest.findMany({

        where: {
          senderId: currentUserId,
        },

        select: {
          receiverId: true,
        },
      });

    // Usuarios skipped
    const skippedProfiles =
      await prisma.skippedProfile.findMany({

        where: {
          userId: currentUserId,
        },

        select: {
          skippedUserId: true,
        },
      });

    const excludedIds = [

      currentUserId,

      ...sentRequests.map(
        (item) => item.receiverId
      ),

      ...skippedProfiles.map(
        (item) => item.skippedUserId
      ),
    ];

    const users =
      await prisma.user.findMany({

        where: {

          id: {
            notIn: excludedIds,
          },

          isActive: true,

          profile: {
            isNot: null,
          },
        },

        select: {
          id: true,
          profile: true,
          preferences: true,
        },
      });

    return users.map((user) => {

      let compatibility = 20;

      // UNIVERSIDAD
      if (
        currentUser.profile?.university &&
        currentUser.profile.university ===
        user.profile?.university
      ) {
        compatibility += 20;
      }

      // CIUDAD
      if (
        currentUser.profile?.city &&
        currentUser.profile.city ===
        user.profile?.city
      ) {
        compatibility += 15;
      }

      // FUMAR
      if (
        currentUser.profile?.smokes !== null &&
        currentUser.profile?.smokes ===
        user.profile?.smokes
      ) {
        compatibility += 10;
      }

      // BEBER
      if (
        currentUser.profile?.drinks !== null &&
        currentUser.profile?.drinks ===
        user.profile?.drinks
      ) {
        compatibility += 10;
      }

      // MASCOTAS
      if (
        currentUser.profile?.pets !== null &&
        currentUser.profile?.pets ===
        user.profile?.pets
      ) {
        compatibility += 10;
      }

      // LIMPIEZA
      if (
        currentUser.profile?.cleanlinessLevel &&
        user.profile?.cleanlinessLevel
      ) {

        const cleanlinessDifference =
          Math.abs(
            currentUser.profile.cleanlinessLevel -
            user.profile.cleanlinessLevel
          );

        compatibility +=
          Math.max(
            0,
            15 - cleanlinessDifference * 3
          );
      }

      // INTERESES
      const commonInterests =
        currentUser.profile?.interests?.filter(
          (interest) =>
            user.profile?.interests?.includes(
              interest
            )
        ) || [];

      compatibility +=
        commonInterests.length * 5;

      // PERSONALIDAD
      if (
        currentUser.profile?.personalityType &&
        currentUser.profile?.personalityType ===
        user.profile?.personalityType
      ) {
        compatibility += 10;
      }

      if (compatibility > 100) {
        compatibility = 100;
      }

      return {

        id: user.id,

        compatibility,

        profile: {

          name:
            user.profile?.name,

          bio:
            user.profile?.bio,

          age:
            user.profile?.age,

          avatarUrl:
            user.profile?.avatarUrl,

          university:
            user.profile?.university,

          city:
            user.profile?.city,

          interests:
            user.profile?.interests || [],
        },
      };
    });
  };

export const likeUser =
  async (
    currentUserId,
    targetUserId
  ) => {

    const existingRequest =
      await prisma.connectionRequest.findFirst({

        where: {

          OR: [

            {
              senderId: currentUserId,
              receiverId: targetUserId,
            },

            {
              senderId: targetUserId,
              receiverId: currentUserId,
            },
          ],
        },
      });

    if (existingRequest) {
      return existingRequest;
    }

    return prisma.connectionRequest.create({

      data: {

        senderId: currentUserId,
        receiverId: targetUserId,
        status: 'PENDING',
      },
    });
  };

export const skipUser =
  async (
    currentUserId,
    skippedUserId
  ) => {

    const existing =
      await prisma.skippedProfile.findFirst({

        where: {

          userId: currentUserId,
          skippedUserId,
        },
      });

    if (existing) {
      return existing;
    }

    return prisma.skippedProfile.create({

      data: {

        userId: currentUserId,
        skippedUserId,
      },
    });
  };

export const getReceivedLikes =
  async (userId) => {

    return prisma.connectionRequest.findMany({

      where: {

        receiverId: userId,
        status: 'PENDING',
      },

      include: {

        sender: {

          select: {
            id: true,
            profile: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  };
