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
                include: {
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

    return await prisma.conversation.findFirst({

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
              include: {
                profile: true,
              },
            },
          },
        },

        messages: {
          include: {
            sender: {
              include: {
                profile: true,
              },
            },
          },

          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
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
          include: {
            profile: true,
          },
        },
      },
    });
  };