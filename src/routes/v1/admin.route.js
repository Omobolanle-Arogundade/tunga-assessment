import express from 'express';
import validate from 'middlewares/validate';
import adminValidation from 'validations/admin.validation';
import adminController from 'controllers/admin.controller';
import catchAsync from 'utils/catchAsync';
import { auth } from 'middlewares/auth';
import { isAdmin } from 'middlewares/admin';

const router = express.Router();

router.get('/permissions', [auth(), isAdmin()], catchAsync(adminController.permissions));

router
 .route('/users')
 .post([auth(), isAdmin('admin_settings')], validate(adminValidation.createUser), catchAsync(adminController.createUser))
 .get([auth(), isAdmin('admin_settings')], validate(adminValidation.fetchUsers), catchAsync(adminController.fetchUsers));

router
 .route('/users/:id')
 .get([auth(), isAdmin('admin_settings')], validate(adminValidation.getUser), catchAsync(adminController.getUser))
 .patch([auth(), isAdmin('admin_settings')], validate(adminValidation.updateUser), catchAsync(adminController.updateUser))
 .delete([auth(), isAdmin('admin_settings')], validate(adminValidation.deleteUser), catchAsync(adminController.deleteUser));

module.exports = router;
