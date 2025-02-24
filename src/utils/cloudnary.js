import { v2 as cloudinary } from 'cloudinary';

export const cloudPhoto = async function () {
    try {
        // Configuration
        cloudinary.config({
            cloud_name: 'dlexewh9h',
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET, // Güvenlik için .env dosyasından al
        });

        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
            {
                public_id: 'shoes',
            }
        );

        console.log('Upload Result:', uploadResult);

        // Optimize delivery by resizing and applying auto-format and auto-quality
        const optimizeUrl = cloudinary.url('coffee', {
            fetch_format: 'auto',
            quality: 'auto',
        });

        console.log('Optimized URL:', optimizeUrl);

        // Transform the image: auto-crop to square aspect_ratio
        const autoCropUrl = cloudinary.url('shoes', {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });

        console.log('Auto-Cropped URL:', autoCropUrl);
    } catch (error) {
        console.error('Error during Cloudinary operation:', error);
    }
};
