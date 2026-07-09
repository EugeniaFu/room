import prisma from '../../config/prisma.js';

// El anfitrión confirma que un roomie se quedó con la publicación:
// esto es lo que el negocio llama "hacer match".
export const confirmMatch = async (
  hostId,
  listingId,
  roomieId
) => {

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new Error('Publicación no encontrada');
  }

  if (listing.ownerId !== hostId) {
    throw new Error('No autorizado');
  }

  if (roomieId === hostId) {
    throw new Error('El anfitrión no puede ser su propio roomie');
  }

  const activeTenancy = await prisma.listingRoommate.findFirst({
    where: {
      userId: roomieId,
      status: 'ACTIVE',
    },
  });

  if (activeTenancy) {

    throw new Error(
      'Este roomie ya tiene una renta activa en otra publicación'
    );
  }

  const existing = await prisma.listingRoommate.findFirst({
    where: {
      listingId,
      userId: roomieId,
    },
  });

  if (existing) {

    if (existing.status === 'ACTIVE') {
      throw new Error('Ya existe un match activo con este roomie');
    }

    return prisma.listingRoommate.update({
      where: { id: existing.id },
      data: {
        status: 'ACTIVE',
        matchedAt: new Date(),
        endedAt: null,
      },
    });
  }

  return prisma.listingRoommate.create({
    data: {
      listingId,
      userId: roomieId,
      status: 'ACTIVE',
      matchedAt: new Date(),
    },
  });
};

export const getMyTenancies = async (userId) => {

  return prisma.listingRoommate.findMany({

    where: {
      OR: [
        { userId },
        { listing: { ownerId: userId } },
      ],
    },

    include: {

      listing: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          ownerId: true,
          owner: {
            select: {
              id: true,
              profile: { select: { name: true, avatarUrl: true } },
            },
          },
        },
      },

      user: {
        select: {
          id: true,
          profile: { select: { name: true, avatarUrl: true } },
        },
      },

      reviews: true,
    },

    orderBy: {
      matchedAt: 'desc',
    },
  });
};

export const endTenancy = async (userId, tenancyId) => {

  const tenancy = await prisma.listingRoommate.findUnique({
    where: { id: tenancyId },
    include: { listing: true },
  });

  if (!tenancy) {
    throw new Error('Match no encontrado');
  }

  const isRoomie = tenancy.userId === userId;
  const isHost = tenancy.listing.ownerId === userId;

  if (!isRoomie && !isHost) {
    throw new Error('No autorizado');
  }

  if (tenancy.status !== 'ACTIVE') {
    throw new Error('Este match no está activo');
  }

  return prisma.listingRoommate.update({
    where: { id: tenancyId },
    data: {
      status: 'ENDED',
      endedAt: new Date(),
    },
  });
};
