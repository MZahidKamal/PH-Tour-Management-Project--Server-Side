"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnImageFromCloudinary = exports.uploadAPDFBufferToCloudinary = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const cloudinary_1 = require("cloudinary");
const envConfig_1 = __importDefault(require("./envConfig"));
const consolePrintFunction_1 = require("../utils/consolePrintFunction");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
cloudinary_1.v2.config({
    cloud_name: envConfig_1.default.cloudinary_cloud_name,
    api_key: envConfig_1.default.cloudinary_api_key,
    api_secret: envConfig_1.default.cloudinary_api_secret,
});
const cloudinaryUpload = cloudinary_1.v2;
exports.default = cloudinaryUpload;
const uploadAPDFBufferToCloudinary = (pdfBuffer, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield new Promise((resolve, reject) => {
            // First, we'll generate a unique public ID for the uploaded file
            const publicId = `${fileName}--${Date.now()}--${Math.random()
                .toString(36)
                .substring(2, 15)}`;
            // Then, we'll create a Cloudinary upload stream with the generated public ID'
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                resource_type: "auto",
                folder: "PHNLB5_M32_PH_Tour_Mng_Proj/pdf_invoices/",
                public_id: publicId,
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error("Cloudinary upload failed: empty result"));
                }
                resolve(result);
            });
            // Then, we'll write the buffer directly to the Cloudinary upload stream
            uploadStream.end(pdfBuffer);
        });
    }
    catch (error) {
        (0, consolePrintFunction_1.consolePrint)(error);
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to upload PDF Buffer to Cloudinary!");
    }
});
exports.uploadAPDFBufferToCloudinary = uploadAPDFBufferToCloudinary;
const deleteAnImageFromCloudinary = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        function extractPublicId(url) {
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
        (0, consolePrintFunction_1.consolePrint)('Image URL:', imageUrl);
        (0, consolePrintFunction_1.consolePrint)('Public ID to delete:', publicId);
        const result = yield cloudinary_1.v2.uploader.destroy(publicId, {
            invalidate: true,
            resource_type: 'image'
        });
        (0, consolePrintFunction_1.consolePrint)('Deletion result:', result);
        if (result.result !== 'ok' && result.result !== 'not found') {
            throw new Error(`Failed to delete image: ${result.result}`);
        }
        return result;
    }
    catch (error) {
        (0, consolePrintFunction_1.consolePrint)('Error deleting image:', error);
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, (error === null || error === void 0 ? void 0 : error.message) || "Failed to delete the image from Cloudinary!");
    }
});
exports.deleteAnImageFromCloudinary = deleteAnImageFromCloudinary;
// To Learn more, visit (https://cloudinary.com/documentation/image_upload_api_reference#signed_upload_syntax).
