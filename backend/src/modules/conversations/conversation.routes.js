import express from 'express';

import * as controller
from './conversation.controller.js';

import { authMiddleware }
from '../../middleware/auth.middleware.js';

const router =
  express.Router();

router.get(
  '/',
  authMiddleware,
  controller.getMyConversations
);

router.get(
  '/:id',
  authMiddleware,
  controller.getConversationById
);

router.post(
  '/:id/messages',
  authMiddleware,
  controller.sendMessage
);

export default router;