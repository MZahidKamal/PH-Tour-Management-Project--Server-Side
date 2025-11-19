/* eslint-disable @typescript-eslint/no-explicit-any */
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary';
import envConfig from "./envConfig";
import {consolePrint} from "../utils/consolePrintFunction";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";





cloudinary.config({
    cloud_name: envConfig.cloudinary_cloud_name as string,
    api_key: envConfig.cloudinary_api_key as string,
    api_secret: envConfig.cloudinary_api_secret as string,
});

const cloudinaryUpload = cloudinary;

export default cloudinaryUpload;





const uploadAPDFBufferToCloudinary = async (pdfBuffer: Buffer, fileName: string): Promise<UploadApiResponse> => {
    try {
        return await new Promise<UploadApiResponse>((resolve, reject) => {

            // First, we'll generate a unique public ID for the uploaded file
            const publicId = `${fileName}--${Date.now()}--${Math.random()
                .toString(36)
                .substring(2, 15)}`;

            // Then, we'll create a Cloudinary upload stream with the generated public ID'
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "PHNLB5_M32_PH_Tour_Mng_Proj/pdf_invoices/",
                    public_id: publicId,
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!result) {
                        return reject(
                            new Error("Cloudinary upload failed: empty result")
                        );
                    }
                    resolve(result);
                }
            );

            // Then, we'll write the buffer directly to the Cloudinary upload stream
            uploadStream.end(pdfBuffer);
        });
    }
    catch (error) {
        consolePrint(error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload PDF Buffer to Cloudinary!");
    }
};





const deleteAnImageFromCloudinary = async (imageUrl: string) => {

    try {
        function extractPublicId(url: string): string {
            // Extract everything after /upload/vXXXXXX/ up to (but not including) the file extension
            const regex = /\/upload\/v\d+\/(.+?)(\.[^.]+)?$/;
            const match = url.match(regex);

            if (!match) {
                throw new Error('Could not extract public_id from URL');
            }

            // Get the full path (folder + filename)
            let publicId = match[1];

            // Remove any file extension (handles both .jpg and .jpg.jpg cases)
            publicId = publicId.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '');

            return publicId;
        }

        const publicId = extractPublicId(imageUrl);

        consolePrint('Image URL:', imageUrl);
        consolePrint('Public ID to delete:', publicId);

        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
            resource_type: 'image'
        });

        consolePrint('Deletion result:', result);

        if (result.result !== 'ok' && result.result !== 'not found') {
            throw new Error(`Failed to delete image: ${result.result}`);
        }

        return result;
    }
    catch (error: any) {
        consolePrint('Error deleting image:', error);
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            error?.message || "Failed to delete the image from Cloudinary!"
        );
    }
};

export {
    uploadAPDFBufferToCloudinary,
    deleteAnImageFromCloudinary
};





// To Learn more, visit (https://cloudinary.com/documentation/image_upload_api_reference#signed_upload_syntax).
