import express from 'express';
import validate from 'middlewares/validate';
import questionValidation from 'validations/question.validation';
import questionController from 'controllers/question.controller';
import catchAsync from 'utils/catchAsync';
import { auth } from 'middlewares/auth';
import { isAdmin } from 'middlewares/admin';

const router = express.Router();

router
 .route('/')
 .post(
  [auth(), isAdmin('questions')],
  validate(questionValidation.createQuestion),
  catchAsync(questionController.createQuestion)
 )
 .get(
  [auth(), isAdmin('questions')],
  validate(questionValidation.fetchQuestions),
  catchAsync(questionController.fetchQuestions)
 );

router
 .route('/:id')
 .get([auth(), isAdmin('questions')], validate(questionValidation.getQuestion), catchAsync(questionController.getQuestion))
 .patch(
  [auth(), isAdmin('questions')],
  validate(questionValidation.updateQuestion),
  catchAsync(questionController.updateQuestion)
 )
 .delete(
  [auth(), isAdmin('questions')],
  validate(questionValidation.deleteUser),
  catchAsync(questionController.deleteQuestion)
 );

module.exports = router;
