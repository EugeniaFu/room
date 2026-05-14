import * as service from './conversation.service.js';

import { getIO }
from '../../socket.js';

export const getMyConversations =
  async (req, res) => {

    try {

      const conversations =
        await service.getMyConversations(
          req.user.userId
        );

      res.json(conversations);

    } catch (error) {

      res.status(400).json({
        error: error.message,
      });
    }
  };

export const getConversationById =
  async (req, res) => {

    try {

      const conversation =
        await service.getConversationById(
          req.params.id,
          req.user.userId
        );

      if (!conversation) {

        return res.status(404).json({
          error:
            'Conversación no encontrada',
        });
      }

      res.json(conversation);

    } catch (error) {

      res.status(400).json({
        error: error.message,
      });
    }
  };

export const sendMessage =
  async (req, res) => {

    try {

      const { content } =
        req.body;

      if (!content) {

        return res.status(400).json({
          error:
            'Mensaje requerido',
        });
      }

      const conversationId =
        req.params.id;

      const message =
        await service.sendMessage(
          conversationId,
          req.user.userId,
          content
        );

      const io = getIO();

      io.to(conversationId).emit(
        'newMessage',
        message
      );

      res.json(message);

    } catch (error) {

      res.status(400).json({
        error: error.message,
      });
    }
  };