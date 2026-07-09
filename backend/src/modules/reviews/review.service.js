import prisma from '../../config/prisma.js';

export const createReview = async (
  reviewerId,
  matchId,
  rating,
  comment,
  category
) => {

  const match = await prisma.listingRoommate.findUnique({
    where: { id: matchId },
    include: { listing: true },
  });

  if (!match) {
    throw new Error('Match no encontrado');
  }

  if (match.status !== 'ENDED') {

    throw new Error(
      'Solo puedes calificar cuando la renta ha finalizado'
    );
  }

  const hostId = match.listing.ownerId;
  const roomieId = match.userId;

  let reviewedId;

  if (reviewerId === roomieId) {
    reviewedId = hostId;
  } else if (reviewerId === hostId) {
    reviewedId = roomieId;
  } else {
    throw new Error('No autorizado');
  }

  const existing = await prisma.review.findFirst({
    where: {
      matchId,
      reviewerId,
    },
  });

  if (existing) {
    throw new Error('Ya calificaste esta convivencia');
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new Error('La calificación debe ser entre 1 y 5');
  }

  return prisma.review.create({
    data: {
      matchId,
      reviewerId,
      reviewedId,
      rating,
      comment,
      category: category || 'GENERAL',
    },
  });
};

export const getReviewsForUser = async (userId) => {

  const reviews = await prisma.review.findMany({

    where: {
      reviewedId: userId,
      isVisible: true,
    },

    include: {
      reviewer: {
        select: {
          id: true,
          profile: { select: { name: true, avatarUrl: true } },
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : null;

  return {
    reviews,
    average,
    count: reviews.length,
  };
};
