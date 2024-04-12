import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as primaryKey } from 'uuid';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const typeImage = file.mimetype.split('/')[0] === 'image';
        if (typeImage) {
            cb(null, 'uploads/images');
        } else {
            cb(null, 'uploads/videos');
        }
        // This operation should be performed after the file has been saved
    },
    filename: function (req, file, cb) {
        try {
            req.body.ids = [...(req.body.ids ?? [])];
            console.log(file.originalname, 'files id_sort', req.body);
            const filename = primaryKey();
            req.body.id_check = filename;
            const typeImage = file.mimetype.split('/')[0] === 'image';
            const tail = typeImage ? '.png' : '.mp4';
            // Set the filename to request body
            const filePath = path.join('uploads/images', filename + tail);
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    // File already exists, generate a new filename
                    const newFilename = primaryKey();
                    console.log('File already exists, generating a new filename');
                    req.body.ids.push({
                        id: newFilename,
                        type: file.mimetype.split('/')[0],
                        tail: typeImage ? 'png' : file.mimetype.split('/')[1],
                        name: file.originalname.split('@_id_get_$')[0],
                        id_client: file.originalname.split('@_id_get_$')[1],
                    });
                    req.body.type = file.mimetype.split('/')[0];
                    req.body.tail = tail;
                    cb(null, newFilename + tail);
                } else {
                    req.body.ids.push({
                        id: filename,
                        type: file.mimetype.split('/')[0],
                        tail: typeImage ? 'png' : file.mimetype.split('/')[1],
                        name: file.originalname.split('@_id_get_$')[0],
                        id_client: file.originalname.split('@_id_get_$')[1],
                    });
                    req.body.type = file.mimetype.split('/')[0];
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
