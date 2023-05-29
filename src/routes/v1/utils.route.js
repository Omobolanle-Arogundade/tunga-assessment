import express from 'express';
import multer from 'multer';

import UtilsController from 'controllers/utils.controller';
import catchAsync from 'utils/catchAsync';
import validate from 'middlewares/validate';
import utilsValidation from 'validations/utils.validation';

const storage = multer.diskStorage({
 filename(req, file, cb) {
  cb(null, `${file.fieldname}-${Date.now()}`);
 },
});
const upload = multer({
 storage,
 limits: { fileSize: 10000000 }, // added limit to file upload
});

const router = express.Router();

router
 .route('/uploads')
 .post(validate(utilsValidation.uploadFile), upload.array('files', 10), catchAsync(UtilsController.uploadFile))
 .delete(validate(utilsValidation.removeFile), catchAsync(UtilsController.removeFile));

module.exports = router;
