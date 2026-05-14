import express from 'express';

import * as controller from './listing.controller.js';

import { authMiddleware } from '../../middleware/auth.middleware.js';
import { roleMiddleware } from '../../middleware/role.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('host'),
  upload.array('images', 10),
  controller.createListing
);

router.get(
  '/my-listings',
  authMiddleware,
  roleMiddleware('host'),
  controller.getMyListings
);

router.get(
  '/:id',
  authMiddleware,
  controller.getListingById
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('host'),
  controller.updateListing
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('host'),
  controller.deleteListing
);

router.get(
  '/',
  authMiddleware,
  controller.getAllListings
);

router.get(
  '/me',
  authMiddleware,
  controller.getMyListings
);

export default router;