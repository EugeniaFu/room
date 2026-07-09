import express from 'express';

import * as controller from './tenancy.controller.js';

import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('host'),
  controller.confirmMatch
);

router.get(
  '/mine',
  authMiddleware,
  controller.getMyTenancies
);

router.put(
  '/:id/end',
  authMiddleware,
  controller.endTenancy
);

export default router;
