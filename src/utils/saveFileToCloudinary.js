import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

cloudinary.v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_URL,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



export const saveFileToCloudinary = async (file) => {
  try {
    if (!file || !file.path) {
      throw new Error('File path is missing');
    }
    const response = await cloudinary.v2.uploader.upload(file.path);
    await fs.unlink(file.path);
    return response.secure_url;
   }catch (error) {
    console.error('Error uploading file to Cloudinary:', error.message);
    throw new Error('Failed to upload file to Cloudinary');
    }

};