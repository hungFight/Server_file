import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as primaryKey } from 'uuid';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // This operation should be performed after the file has been saved
        cb(null, 'uploads/images');
    },
    filename: function (req, file, cb) {
        try {
            const filename = primaryKey();
            const tail = '.png';
            // Set the filename to request body
            const filePath = path.join('uploads/images', filename + tail);
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    // File already exists, generate a new filename
                    const newFilename = primaryKey();
                    req.body.id_file = newFilename;
                    console.log('File already exists, generating a new filename');
                    cb(null, newFilename + tail);
                } else {
                    req.body.id_file = filename;
                    req.body.tail = tail;
                    cb(null, filename + tail);
                }
            });
        } catch (error: any) {
            cb(error, '');
        }
    },
});

const upload = multer({ storage: storage });
export default upload;
