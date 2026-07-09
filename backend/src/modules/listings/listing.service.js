import prisma from '../../config/prisma.js';

// Campos de detalle del inmueble que llegan como texto (FormData)
// y deben convertirse a arreglo, número o booleano.
const parseArrayField = (value) => {

  if (Array.isArray(value)) return value;

  if (!value) return [];

  try {
    return JSON.parse(value);
  } catch {
    return String(value)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const parseBooleanField = (value) => {
  return value === true || value === 'true';
};

const buildListingDetails = (data) => ({

  rentalMode: data.rentalMode || undefined,
  bedroomCount:
    data.bedroomCount !== undefined
      ? parseInt(data.bedroomCount, 10)
      : undefined,
  roomOwnership: data.roomOwnership || undefined,
  floor:
    data.floor !== undefined
      ? parseInt(data.floor, 10)
      : undefined,
  amenities: parseArrayField(data.amenities),

  hasPetsNow: parseBooleanField(data.hasPetsNow),
  petsAllowed: parseBooleanField(data.petsAllowed),
  allowedPetTypes: parseArrayField(data.allowedPetTypes),
  privateAreas: parseArrayField(data.privateAreas),
  sharedAreas: parseArrayField(data.sharedAreas),

  includedServices: parseArrayField(data.includedServices),
  extraServices: parseArrayField(data.extraServices),
  neighborhood: data.neighborhood || undefined,
  nearbyLandmark: data.nearbyLandmark || undefined,
  minStayMonths:
    data.minStayMonths !== undefined
      ? parseInt(data.minStayMonths, 10)
      : undefined,

  seekingGender:
    data.seekingGender !== undefined
      ? data.seekingGender || null
      : undefined,
  wheelchairAccessible: parseBooleanField(
    data.wheelchairAccessible
  ),
  hostDescription: data.hostDescription || undefined,
  seekingRoommateBio: data.seekingRoommateBio || undefined,
  houseRules: parseArrayField(data.houseRules),
});

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

      ...buildListingDetails(data),

      // toda publicación nueva entra pendiente de revisión del admin
      reviewStatus: 'PENDING',

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

        select: {
          id: true,
          verificationStatus: true,
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

      ...buildListingDetails(data),

      // cualquier edición vuelve a pedir revisión del admin
      reviewStatus: 'PENDING',
      reviewedById: null,
      reviewedAt: null,

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

export const getPendingListings = async () => {

  return prisma.listing.findMany({

    where: {
      reviewStatus: 'PENDING',
    },

    include: {

      location: true,

      images: true,

      owner: {

        select: {

          id: true,

          email: true,

          profile: true,
        },
      },
    },

    orderBy: {
      createdAt: 'asc',
    },
  });
};

export const reviewListing = async (
  adminId,
  listingId,
  decision, // 'APPROVED' | 'REJECTED'
  notes
) => {

  if (
    decision !== 'APPROVED' &&
    decision !== 'REJECTED'
  ) {

    throw new Error(
      'Decisión inválida'
    );
  }

  const listing =
    await prisma.listing.findUnique({
      where: { id: listingId },
    });

  if (!listing) {

    throw new Error(
      'Publicación no encontrada'
    );
  }

  return prisma.listing.update({

    where: { id: listingId },

    data: {

      reviewStatus: decision,

      reviewedById: adminId,

      reviewedAt: new Date(),
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

    where: {
      reviewStatus: 'APPROVED',
      status: 'ACTIVE',
    },

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