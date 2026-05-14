import prisma from '../../config/prisma.js';

export const sendRequest = async (
  senderId,
  receiverId
) => {

  if (senderId === receiverId) {

    throw new Error(
      'No puedes enviarte solicitud'
    );
  }

  const existing =
    await prisma.connectionRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    });

  if (existing) {

    throw new Error(
      'La solicitud ya existe'
    );
  }

  return prisma.connectionRequest.create({
    data: {
      senderId,
      receiverId,
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
          include: {
            profile: true,
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

    // SI ACEPTA -> crear conversación
    if (status === 'ACCEPTED') {

      const conversation =
        await prisma.conversation.create({
          data: {

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
        });

      return {
        request: updated,
        conversation,
      };
    }

    return updated;
  };