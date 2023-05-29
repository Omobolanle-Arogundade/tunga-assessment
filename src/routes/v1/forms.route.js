import express from 'express';
import validate from 'middlewares/validate';
import formValidation from 'validations/form.validation';
import formController from 'controllers/form.controller';
import catchAsync from 'utils/catchAsync';
import { auth } from 'middlewares/auth';
import { isAdmin } from 'middlewares/admin';

const router = express.Router();

router
 .route('/')
 .post([auth(), isAdmin('forms')], validate(formValidation.createForm), catchAsync(formController.createForm))
 .get([auth()], validate(formValidation.fetchForms), catchAsync(formController.fetchForms));

router
 .route('/:id')
 .get([auth()], validate(formValidation.getForm), catchAsync(formController.getForm))
 .patch([auth(), isAdmin('questions')], validate(formValidation.updateForm), catchAsync(formController.updateForm))
 .delete([auth(), isAdmin('questions')], validate(formValidation.deleteForm), catchAsync(formController.deleteForm));

module.exports = router;
