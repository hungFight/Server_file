import express from 'express';
import fs from 'fs';
import path from 'path';
class FileStory {
    addFile = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            console.log(req.body, 'body_ol');
            // Generate a unique filename using UUID
            if (req.body.old_id) {
                const filePath = path.join(__dirname, '../../uploads/images', req.body.old_id + req.body.tail); // Path to the uploaded file
                // File does not exist, continue with the current filename
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.error('deleting file successful');
                    }
                });
            }
            const filePath = path.join(__dirname, '../../uploads/images', `${req.body.id_file + req.body.tail}`); // Path to the uploaded file
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    return res.status(404).json(false);
                }
                return res.status(200).json(req.body.id_file);
            });
        } catch (error) {
            console.error('Error reading file:', error);
            next(error);
        }
    };
    getFile = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const fileId = req.params.id;
            const filePath = path.join(__dirname, '../../uploads/images', fileId + '.png'); // Path to the uploaded file
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(404).send('File not found');
                }
            });
        } catch (error) {
            console.error('Error reading file:', error);
            next(error);
        }
    };
    deleteFile = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const fileId = req.body.id_file;
            const filePath = path.join(__dirname, '../../uploads/images', fileId + '.png'); // Path to the uploaded file
            // File does not exist, continue with the current filename
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json(false);
                }
                return res.status(200).json(true);
            });
        } catch (error) {
            console.error('Error reading file:', error);
            next(error);
        }
    };
}
export default new FileStory();
