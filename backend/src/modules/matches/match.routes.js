import express from 'express';

import * as controller
from './match.controller.js';

import { authMiddleware }
from '../../middleware/auth.middleware.js';

const router =
  express.Router();

router.get(
  '/',
  authMiddleware,
  controller.getPotentialMatches
);

router.post(
  '/:id/like',
  authMiddleware,
  controller.likeUser
);

router.post(
  '/:id/skip',
  authMiddleware,
  controller.skipUser
);

router.get(
  '/requests/received',
  authMiddleware,
  controller.getReceivedLikes
);

export default router;