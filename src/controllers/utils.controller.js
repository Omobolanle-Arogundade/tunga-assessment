import httpStatus from 'http-status';
import UtilsService from '../services/utils.service';
import ApiError from '../utils/ApiError';

export default class UtilController {
 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async uploadImage(req, res) {
  const { path, tags, height, width } = req.body;

  const pictureFiles = req.files;
  if (!pictureFiles) {
   throw new ApiError(httpStatus.BAD_REQUEST, 'file is required');
  }

  const data = await UtilsService.imageUpload(pictureFiles, { path, tags, height, width });
  res.send({ data, message: 'Images uploaded successfully' });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async removeImage(req, res) {
  const { path, image } = req.body;
  const data = await UtilsService.removeImage(`${path}/${image}`);
  res.send({ data, message: 'Images removed successfully' });
 }
}
