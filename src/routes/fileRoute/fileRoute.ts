import express from 'express';
import fileController from '../../controllers/fileController';
import upload from '../../middleware/fileWorker';

const router = express.Router();
router.post('/addFiles', upload.array('file'), fileController.addFile);
router.get('/getFileImg/:id', fileController.getFileImg);
router.get('/getFileVideo/:id', fileController.getFileVideo);
router.post('/deleteFileImg', fileController.deleteFileImg);
export default router;
