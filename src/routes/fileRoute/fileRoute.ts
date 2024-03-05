import express from 'express';
import fileController from '../../controllers/fileController';
import upload from '../../middleware/fileWorker';

const router = express.Router();
router.post('/addFiles', upload.single('file'), fileController.addFile);
router.get('/getFile/:id', fileController.getFile);
router.post('/deleteFile', fileController.deleteFile);
export default router;
