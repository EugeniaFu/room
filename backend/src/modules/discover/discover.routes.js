import express from 'express';

import * as controller
from './discover.controller.js';

import { authMiddleware }
from '../../middleware/auth.middleware.js';

const router =
  express.Router();

router.get(
  '/',
  authMiddleware,
  controller.discoverUsers
);

export default router;