import  multer  from 'multer';
import {CloudinaryStorage} from "multer-storage-cloudinary";
import cloudinaryUpload from "./cloudinary.config";
import path from "node:path";



const storage = new CloudinaryStorage(
    {
        cloudinary: cloudinaryUpload,
        params: async (req, file) => {

            const base = path.parse(file.originalname).name; // name without extension

            const fileName = base?.toLowerCase()
                .replace(/[._\s]+/g, "-")    // underscores, dots, spaces → dash
                .replace(/[^a-z0-9-]/g, "")  // keep only a–z 0–9 and hyphen
                .replace(/-+/g, "-")         // collapse multiple dashes
                .replace(/^-+|-+$/g, "");    // trim leading/trailing dashes

            const uniqueNumber = Math.random().toString(36).slice(2);

            const extension = path.parse(file.originalname).ext;
            if (!extension) {
                throw new Error('File extension is missing!');
            }

            // const uniqueFileName = `${fileName}-${uniqueNumber}-${Date.now()}${extension}`;
            const uniqueFileName = `${fileName}-${uniqueNumber}-${Date.now()}`;

            // consolePrint(uniqueFileName);

            return {
                folder: 'PHNLB5_M32_PH_Tour_Mng_Proj',
                public_id: uniqueFileName,
            };
        }
    }
)



export const multerUpload = multer({storage: storage});
