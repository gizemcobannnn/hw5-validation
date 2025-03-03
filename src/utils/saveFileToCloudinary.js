import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises'
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  try {
    const response = await cloudinary.uploader.upload(file.path);
    await fs.unlink(file.path); // Başarılı yükleme sonrası dosyayı kaldır
    return response.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('File upload failed'); // Hata fırlat
  }
};