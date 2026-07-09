import prisma from '../../config/prisma.js';

export const sendRequest = async (
  senderId,
  receiverId,
  listingId
) => {

  if (senderId === receiverId) {

    throw new Error(
      'No puedes enviarte solicitud'
    );
  }

  const existing =
    await prisma.connectionRequest.findFirst({
      where: {
        senderId,
        receiverId,
        listingId: listingId || null,
      },
    });

  if (existing) {

    throw new Error(
      listingId
        ? 'Ya contactaste al anfitrión sobre esta publicación'
        : 'La solicitud ya existe'
    );
  }

  return prisma.connectionRequest.create({
    data: {
      senderId,
      receiverId,
      listingId: listingId || null,
    },
  });
};

export const getReceivedRequests =
  async (userId) => {

    return prisma.connectionRequest.findMany({
      where: {
        receiverId: userId,
      },

      include: {
        sender: {
          select: {
            id: true,
            profile: true,
          },
        },

        listing: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  };

export const updateRequestStatus =
  async (
    requestId,
    userId,
    status
  ) => {

    const request =
      await prisma.connectionRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!request) {

      throw new Error(
        'Solicitud no encontrada'
      );
    }

    if (
      request.receiverId !== userId
    ) {

      throw new Error(
        'No autorizado'
      );
    }

    const updated =
      await prisma.connectionRequest.update({
        where: {
          id: requestId,
        },

        data: {
          status,
        },
      });

    // SI ACEPTA -> crear conversación (o reusar la existente para esa publicación)
    if (status === 'ACCEPTED') {

      const existingConversation =
        request.listingId
          ? await prisma.conversation.findFirst({
              where: {
                listingId: request.listingId,
                participants: {
                  some: { userId: request.senderId },
                },
                AND: {
                  participants: {
                    some: { userId: request.receiverId },
                  },
                },
              },
            })
          : null;

      const conversation =
        existingConversation ||
        (await prisma.conversation.create({
          data: {

            listingId: request.listingId,

            participants: {
              create: [
                {
                  userId:
                    request.senderId,
                },
                {
                  userId:
                    request.receiverId,
                },
              ],
            },
          },
        }));

      return {
        request: updated,
        conversation,
      };
    }

    return updated;
  };