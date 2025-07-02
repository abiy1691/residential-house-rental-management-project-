import multer from "multer";
import {unlink} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import { createError } from "./CreateError.js";

const file_name = function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + '.jpg')
}

// TODO: Required fields must be check;
const filtering = function (req, file, cb) {
    const allowed_image_mime = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowed_image_extensions = ['png', 'jpeg', 'jpg', 'webp'];
    const extensions = file.originalname.split('.')
    
    if (!allowed_image_extensions.includes(extensions[extensions.length - 1].trim()))
        return cb(new Error('This image extensions is not allowed.'))
    if (!allowed_image_mime.includes(file.mimetype))
        return cb(new Error('This image format is not allowed.'))
    if (file.size > 1024*3)
        return cb(new Error('The size of the image is too big'))
    cb(null, true)
}

const destination = function (req, file, cb) {
    if (file.fieldname === 'contract')
        return cb(null, __dirname+'/../contracts')
    if (file.fieldname === 'nationalid')
        return cb(null, __dirname+'/../nationalids')
    if (file.fieldname === 'verification')
        return cb(null, __dirname+'/../verifications')
    return cb(null, __dirname+'/../uploads')
}

const __dirname = import.meta.dirname;

const storage = multer.diskStorage({
    filename: file_name,
    destination: destination,
});

const uploader = multer({
    storage,
    fileFilter: filtering
});

export const removeImage = async (path) => {
    try {
        if (!existsSync(path))
            throw createError(400, "File not found")
        return unlink(path);   
    } catch (error) {
        throw error
    }
} 

export default uploader