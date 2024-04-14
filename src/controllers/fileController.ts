import express from 'express';
import fs from 'fs';
import path from 'path';
class FileStory {
    addFile = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            // Generate a unique filename using UUID
            if (req.body.old_id) {
                const filePath = path.join(
                    __dirname,
                    req.body.type === 'image' ? '../../uploads/images' : '../../uploads/video',
                    req.body.old_id + req.body.tail,
                ); // Path to the uploaded file
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
                    const filePath = path.join(
                        __dirname,
                        req.body.type === 'image' ? '../../uploads/images' : '../../uploads/video',
                        id + req.body.tail,
                    ); // Path to the uploaded file
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
    getFileImg = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const fileId = req.params.id;
        const filePath = path.join(__dirname, '../../uploads/images', fileId + '.png'); // Path to the uploaded file
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('File not found:', err);
                const filePathEr = path.join(__dirname, '../../uploads/error', 'fileNotFound' + '.png'); // Path to the uploaded file
                return res.sendFile(filePathEr, (err) => {
                    if (err) {
                        console.error('Error sending img file:', err);
                        return res.status(500).json({ message: 'Error sending file' });
                    }
                });
            }
            return res.sendFile(filePath, (err) => {
                const filePathEr = path.join(__dirname, '../../uploads/error', 'fileNotFound' + '.png'); // Path to the uploaded file
                if (err) {
                    return res.sendFile(filePathEr, (err) => {
                        if (err) {
                            console.error('Error sending img file:', err);
                            return res.status(500).json({ message: 'Error sending file' });
                        }
                    });
                }
            });
        });
    };
    getFileVideo = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const fileId = req.params.id;
        const filePath = path.join(__dirname, '../../uploads/videos', fileId + '.mp4'); // Path to the uploaded file
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('File not found:', err);
                const filePathEr = path.join(__dirname, '../../uploads/error', fileId + '.mp4'); // Path to the uploaded file
                return res.sendFile(filePathEr, (err) => {
                    if (err) {
                        console.error('Error sending video file:', err);
                        return res.status(500).json({ message: 'Error sending video file' });
                    }
                });
            }
            // File exists, send it as a response
            return res.sendFile(filePath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    const filePathEr = path.join(__dirname, '../../uploads/error', fileId + '.mp4'); // Path to the uploaded file
                    return res.sendFile(filePathEr, (err) => {
                        if (err) {
                            console.error('Error sending file:', err);
                            return res.status(500).json({ message: 'Error sending file' });
                        }
                    });
                }
            });
        });
    };
    deleteFileImg = (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    deleteFileVideo = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const fileIds: string[] = req.body.ids;
            fileIds.forEach((f) => {
                const filePath = path.join(__dirname, '../../uploads/videos', f + '.mp4'); // Path to the uploaded file
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
