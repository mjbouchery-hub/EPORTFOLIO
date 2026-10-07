import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryResourceType = "image" | "video";
type CloudinaryDeliveryType = "upload" | "authenticated";

export const deleteCloudinaryAsset = async (
  publicId: string,
  resourceType: CloudinaryResourceType,
  deliveryType: CloudinaryDeliveryType,
) => {
  return cloudinary.v2.uploader.destroy(publicId, {
    resource_type: resourceType,
    type: deliveryType,
    invalidate: true,
  });
};

export default cloudinary.v2;