import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./env.js";

// Cloudinary config
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadFileToCloudinary = async (fileBuffer: Buffer, folder: string) => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    upload.end(fileBuffer);
  });
};

const uploadPdfToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
  originalName: string
) => {
  return new Promise((resolve, reject) => {
    const cleanName = originalName.replace(/\.[^/.]+$/, "");

    const upload = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "pdf",
        public_id: cleanName,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    upload.end(fileBuffer);
  });
};

export { uploadFileToCloudinary, uploadPdfToCloudinary };
