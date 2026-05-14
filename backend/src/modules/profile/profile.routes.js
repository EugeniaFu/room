import express from 'express';

import * as controller from './profile.controller.js';

import { authMiddleware } from '../../middleware/auth.middleware.js';

import { uploadAvatar } from '../../middleware/avatarUpload.middleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  controller.createProfile
);

router.get(
  '/me',
  authMiddleware,
  controller.getMyProfile
);

router.put(
  '/',
  authMiddleware,
  controller.updateProfile
);

router.get(
  '/:id',
  authMiddleware,
  controller.getProfileById
);

router.post(
  '/avatar',
  authMiddleware,
  uploadAvatar.single('avatar'),
  controller.uploadProfileAvatar
);

export default router;