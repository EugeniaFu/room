import prisma from '../../config/prisma.js';

export const getMyConversations =
  async (userId) => {

    const conversations =
      await prisma.conversation.findMany({

        where: {
          participants: {
            some: {
              userId,
            },
          },
        },

        include: {

          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  profile: true,
                },
              },
            },
          },

          messages: {
            orderBy: {
              createdAt: 'desc',
            },

            take: 1,
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

    return conversations.map(
      (conversation) => {

        const otherUser =
          conversation.participants.find(
            (p) => p.userId !== userId
          )?.user;

        return {

          id: conversation.id,

          otherUser,

          listing: conversation.listing,

          lastMessage:
            conversation.messages[0]
              ?.content || '',

          lastMessageTime:
            conversation.messages[0]
              ?.createdAt || null,
        };
      }
    );
  };

  export const getConversationById =
  async (
    conversationId,
    userId
  ) => {

    const conversation = await prisma.conversation.findFirst({

      where: {
        id: conversationId,

        participants: {
          some: {
            userId,
          },
        },
      },

      include: {

        participants: {
          include: {
            user: {
              select: {
                id: true,
                profile: true,
              },
            },
          },
        },

        messages: {
          include: {
            sender: {
              select: {
                id: true,
                profile: true,
              },
            },
          },

          orderBy: {
            createdAt: 'asc',
          },
        },

        listing: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            ownerId: true,
          },
        },
      },
    });

    if (!conversation || !conversation.listing) {
      return conversation;
    }

    const roomieParticipant =
      conversation.participants.find(
        (p) => p.userId !== conversation.listing.ownerId
      );

    const tenancy = roomieParticipant
      ? await prisma.listingRoommate.findFirst({
          where: {
            listingId: conversation.listing.id,
            userId: roomieParticipant.userId,
          },
          orderBy: {
            matchedAt: 'desc',
          },
        })
      : null;

    return {
      ...conversation,
      tenancy,
      roomieId: roomieParticipant?.userId || null,
    };
  };

export const sendMessage =
  async (
    conversationId,
    senderId,
    content
  ) => {

    return await prisma.message.create({

      data: {
        conversationId,
        senderId,
        content,
      },

      include: {
        sender: {
          select: {
            id: true,
            profile: true,
          },
        },
      },
    });
  };