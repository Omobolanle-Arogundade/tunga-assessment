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
  * @param {*} image
  * @param {*} options
  */
 static async imageUpload(pictureFiles, { path: imagePath, tags /* height, width */ }) {
  try {
   const multiplePicturePromise = pictureFiles.map((picture) =>
    cloudinary.uploader.upload(picture.path, {
     public_id: `${imagePath}/${picture.filename}`,
     tags,
     //  transformation: { width: width || 350, height: height || 350 },
    })
   );
   const imageResponses = await Promise.all(multiplePicturePromise);
   return imageResponses;
  } catch (error) {
   logger.error('error uploading image');
   logger.error(error);
   throw error;
  }
 }

 /**
  *
  * @param {*} image
  */
 static async removeImage(image) {
  try {
   const _image = await cloudinary.uploader.destroy(image);
   return _image;
  } catch (error) {
   logger.error('error removing image');
   logger.error(error);
   throw error;
  }
 }
}
