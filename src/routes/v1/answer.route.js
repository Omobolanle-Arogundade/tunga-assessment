import express from 'express';
import validate from 'middlewares/validate';
import answerValidation from 'validations/answer.validation';
import answerController from 'controllers/answer.controller';
import catchAsync from 'utils/catchAsync';
import { auth } from 'middlewares/auth';

const router = express.Router();

router
 .route('/')
 .put([auth()], validate(answerValidation.answerQuestions), catchAsync(answerController.answerQuestions))
 .get([auth()], validate(answerValidation.fetchUserAnswers), catchAsync(answerController.fetchUserAnswers));

// router
//  .route('/:id')
//  .get([auth(), isAdmin('questions')], validate(questionValidation.getQuestion), catchAsync(questionController.getQuestion))
//  .patch(
//   [auth(), isAdmin('questions')],
//   validate(questionValidation.updateQuestion),
//   catchAsync(questionController.updateQuestion)
//  )
//  .delete(
//   [auth(), isAdmin('questions')],
//   validate(questionValidation.deleteUser),
//   catchAsync(questionController.deleteQuestion)
//  );

module.exports = router;
