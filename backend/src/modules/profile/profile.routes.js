import express from 'express';

import * as controller from './profile.controller.js';

import { authMiddleware } from '../../middleware/auth.middleware.js';

import { uploadAvatar } from '../../middleware/avatarUpload.middleware.js';

import { uploadDocument } from '../../middleware/documentUpload.middleware.js';

import { roleMiddleware } from '../../middleware/role.middleware.js';

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

router.post(
  '/avatar',
  authMiddleware,
  uploadAvatar.single('avatar'),
  controller.uploadProfileAvatar
);

router.post(
  '/documents',
  authMiddleware,
  uploadDocument.single('document'),
  controller.uploadDocument
);

router.get(
  '/documents/me',
  authMiddleware,
  controller.getMyDocuments
);

router.get(
  '/verifications/pending',
  authMiddleware,
  roleMiddleware('admin'),
  controller.getPendingVerifications
);

router.put(
  '/verifications/:userId',
  authMiddleware,
  roleMiddleware('admin'),
  controller.reviewVerification
);

router.get(
  '/:id',
  authMiddleware,
  controller.getProfileById
);

export default router;