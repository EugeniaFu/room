import express from 'express';

import * as controller from './review.controller.js';

import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  controller.createReview
);

router.get(
  '/user/:userId',
  authMiddleware,
  controller.getReviewsForUser
);

export default router;
