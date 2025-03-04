import cloudinary from 'cloudinary';
import fs from 'fs/promises'
import {env} from './env.js'
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});


console.log("Cloudinary Config:", cloudinary.config()); // Config'in geldiğini doğrula

export const saveFileToCloudinary = async (file) => {
  try {
    console.log("Cloudinary Config (after setup):", cloudinary.config());
    const response = await cloudinary.v2.uploader.upload(file.path,{folder: "contacts", });
    await fs.unlink(file.path); // Başarılı yükleme sonrası dosyayı kaldır
    return response.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('File upload failed'); 
  }
};

export default cloudinary;