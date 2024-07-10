import { v2 as cloudinary } from "cloudinary";
import { envs } from "./envs";

/**
 * Configure cloudinary SDK with credentials
 * @returns Cloudinary configuration
 */
export const initializeCloudinary = () => {
  cloudinary.config({
    cloud_name: envs.cloudinaryCloudName,
    api_key: envs.cloudinaryApiKey,
    api_secret: envs.cloudinaryApiSecret,
    secure: true,
  });
};

export { cloudinary };
