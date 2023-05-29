import express from 'express';
import authRoutes from './auth.route';
import adminRoutes from './admin.route';
import questionRoutes from './question.route';
import formRoutes from './forms.route';
import answerRoutes from './answer.route';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/admin', adminRoutes);

router.use('/question', questionRoutes);

router.use('/form', formRoutes);

router.use('/answer', answerRoutes);

module.exports = router;
