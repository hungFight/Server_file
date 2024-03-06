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
                fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error('Error deleting file:', err);
                            } else {
                                console.error('deleting file successful');
                            }
                        });
                    }
                });
                // File does not exist, continue with the current filename
            } else if (req.body.old_ids) {
                req.body.old_ids.map((id: string) => {
                    const filePath = path.join(__dirname, '../../uploads/images', id + req.body.tail); // Path to the uploaded file
                    fs.access(filePath, fs.constants.F_OK, (err) => {
                        if (!err)
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error('Error deleting file:', err);
                                } else {
                                    console.error('deleting file successful');
                                }
                            });
                    });
                    // File does not exist, continue with the current filename
                });
            }
            if (req.body.ids.length)
                // id from fileWorker.ts
                return res.status(200).json(req.body.ids);
            return res.status(404).json(false);
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
                    res.status(404).json({ message: false });
                }
            });
        } catch (error) {
            console.error('Error reading file:', error);
            next(error);
        }
    };
    deleteFile = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const fileIds: string[] = req.body.ids;
            fileIds.forEach((f) => {
                const filePath = path.join(__dirname, '../../uploads/images', f + '.png'); // Path to the uploaded file
                // File does not exist, continue with the current filename
                fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (!err)
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error('Error deleting file:', err);
                                return res.status(500).json(false);
                            }
                        });
                });
            });
            return res.status(200).json(true);
        } catch (error) {
            console.error('Error reading file:', error);
            next(error);
        }
    };
}
export default new FileStory();
