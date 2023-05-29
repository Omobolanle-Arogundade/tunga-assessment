import express from 'express';
import passport from 'passport';
import validate from 'middlewares/validate';
import authValidation from 'validations/auth.validation';
import authController from 'controllers/auth.controller';
import catchAsync from 'utils/catchAsync';
import { auth } from 'middlewares/auth';

const router = express.Router();

router.post('/sendOTP', validate(authValidation.sendOTP), catchAsync(authController.sendOTP));

router.post('/verifyOTP', validate(authValidation.verifyOTP), catchAsync(authController.verifyOTP));

router.post('/register', validate(authValidation.register), catchAsync(authController.register));

router.post('/login', validate(authValidation.login), catchAsync(authController.login));

router.get('/facebook', passport.authenticate('facebook', { scope: [['email']] }));

router.get(
 '/facebook/callback',
 passport.authenticate('facebook', { scope: ['email'] }),
 catchAsync(authController.facebookAuth)
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google'), catchAsync(authController.googleAuth));

router.post('/reset-password', validate(authValidation.resetPassword), catchAsync(authController.resetPassword));

router.post('/update-password', auth(), validate(authValidation.updatePassword), catchAsync(authController.updatePassword));

router.post('/verify-password', auth(), validate(authValidation.verifyPassword), catchAsync(authController.verifyPassword));

router.post('/refresh-tokens', validate(authValidation.refreshTokens), catchAsync(authController.refreshTokens));

router.get('/me', auth(), catchAsync(authController.getUser));

module.exports = router;
