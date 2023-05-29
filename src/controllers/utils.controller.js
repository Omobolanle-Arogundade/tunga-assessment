import httpStatus from 'http-status';
import UtilsService from '../services/utils.service';
import ApiError from '../utils/ApiError';

export default class UtilController {
 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async uploadFile(req, res) {
  const { path, tags, height, width } = req.body;

  const { files } = req;
  if (!files) {
   throw new ApiError(httpStatus.BAD_REQUEST, 'file is required');
  }

  const data = await UtilsService.fileUpload(files, { path, tags, height, width });
  res.send({ data, message: 'Files uploaded successfully' });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async removeFile(req, res) {
  const { path, file } = req.query;
  const data = await UtilsService.removeFile(`${path}/${file}`);
  res.send({ data, message: 'Files removed successfully' });
 }
}
