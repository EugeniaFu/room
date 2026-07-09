import express from 'express';
import * as controller from './auth.controller.js';

const router = express.Router();

router.post('/register', controller.register);
router.post('/verify-email', controller.verifyEmail);
router.post('/resend-code', controller.resendVerificationCode);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);
router.post('/login', controller.login);

export default router;