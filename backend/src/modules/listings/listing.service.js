import prisma from '../../config/prisma.js';

export const createListing = async (
  userId,
  data
) => {

  return prisma.listing.create({

    data: {

      ownerId: userId,

      title: data.title,

      description: data.description,

      // CONVERTIR
      price: parseFloat(data.price),

      type: data.type,

      location: {

        create: {

          country: data.country,

          state: data.state,

          city: data.city,

          // CONVERTIR
          latitude: parseFloat(data.latitude),

          // CONVERTIR
          longitude: parseFloat(data.longitude),
        }
      },

      images: {

        create: data.images.map((url) => ({
          url
        }))
      }
    },

    include: {
      location: true,
      images: true
    }
  });
};

export const getListingById = async (id) => {

  const listing = await prisma.listing.findUnique({

    where: { id },

    include: {

      location: true,

      images: true,

      owner: {

        include: {
          profile: true
        }
      }
    }
  });

  if (!listing) {

    throw new Error(
      'Publicación no encontrada'
    );
  }

  return listing;
};

export const updateListing = async (
  userId,
  listingId,
  data
) => {

  const listing =
    await prisma.listing.findUnique({
      where: {
        id: listingId
      },

      include: {
        location: true,
        images: true
      }
    });

  if (!listing) {

    throw new Error(
      'Publicación no encontrada'
    );
  }

  if (listing.ownerId !== userId) {

    throw new Error(
      'No autorizado'
    );
  }

  return prisma.listing.update({
    where: {
      id: listingId
    },

    data: {

      title: data.title,

      description:
        data.description,

      price: Number(data.price),

      type: data.type,

      location: {

        update: {

          country: data.country,

          state: data.state,

          city: data.city,

          latitude:
            Number(data.latitude),

          longitude:
            Number(data.longitude),
        },
      },
    },

    include: {
      location: true,
      images: true,
    },
  });
};

export const deleteListing = async (
  userId,
  listingId
) => {

  const listing =
    await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        images: true,
        location: true,
      },
    });

  if (!listing) {

    throw new Error(
      'Publicación no encontrada'
    );
  }

  if (listing.ownerId !== userId) {

    throw new Error(
      'No autorizado'
    );
  }

  // Eliminar imágenes
  await prisma.listingImage.deleteMany({
    where: {
      listingId,
    },
  });

  // Eliminar ubicación
  await prisma.location.deleteMany({
    where: {
      listingId,
    },
  });

  // Eliminar publicación
  await prisma.listing.delete({
    where: {
      id: listingId,
    },
  });

  return {
    message:
      'Publicación eliminada correctamente',
  };
};

export const getAllListings = async () => {

  return prisma.listing.findMany({

    include: {

      location: true,

      images: true,

      owner: {

        select: {

          id: true,

          email: true,

          verificationStatus: true,

          profile: true
        }
      }
    },

    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getMyListings = async (
  userId
) => {

  return prisma.listing.findMany({

    where: {
      ownerId: userId
    },

    include: {
      location: true,
      images: true,
    },

    orderBy: {
      createdAt: 'desc'
    }
  });
};