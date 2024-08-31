import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinary = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    return result;
  } catch (error: any) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const deleteFromCloudinary = async (public_id: string) => {
  try {
    const folder = "social_media_app";
    public_id = folder + "/" + public_id;
    await cloudinary.uploader.destroy(public_id);
  } catch (error: any) {
    throw new Error(`Deleting files on cloudinary failed: ${error.message}`);
  }
};

export { uploadToCloudinary, deleteFromCloudinary };
