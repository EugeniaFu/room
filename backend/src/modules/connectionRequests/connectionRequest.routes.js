import express from 'express';

import * as controller from './connectionRequest.controller.js';

import { authMiddleware }
  from '../../middleware/auth.middleware.js';

const router =
  express.Router();

router.post(
  '/',
  authMiddleware,
  controller.sendRequest
);

router.get(
  '/received',
  authMiddleware,
  controller.getReceivedRequests
);

router.put(
  '/:id/accept',
  authMiddleware,
  controller.acceptRequest
);

router.put(
  '/:id/reject',
  authMiddleware,
  controller.rejectRequest
);

export default router;