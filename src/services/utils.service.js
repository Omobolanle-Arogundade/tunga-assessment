import { v2 as cloudinary } from 'cloudinary';
import logger from '../config/logger';
import config from '../config';

cloudinary.config({
 cloud_name: config.cloudinary.cloudName,
 api_key: config.cloudinary.apiKey,
 api_secret: config.cloudinary.apiSecret,
});

export default class UtilsService {
 /**
  *
  * @param {*} file
  * @param {*} options
  */
 static async fileUpload(pictureFiles, { path: filePath, tags /* height, width */ }) {
  try {
   const multiplePicturePromise = pictureFiles.map((picture) =>
    cloudinary.uploader.upload(picture.path, {
     public_id: `${filePath}/${picture.filename}`,
     tags,
     //  transformation: { width: width || 350, height: height || 350 },
    })
   );
   const fileResponses = await Promise.all(multiplePicturePromise);
   return fileResponses;
  } catch (error) {
   logger.error('error uploading file');
   logger.error(error);
   throw error;
  }
 }

 /**
  *
  * @param {*} file
  */
 static async removeFile(file) {
  try {
   const _file = await cloudinary.uploader.destroy(file);
   return _file;
  } catch (error) {
   logger.error('error removing file');
   logger.error(error);
   throw error;
  }
 }
}
