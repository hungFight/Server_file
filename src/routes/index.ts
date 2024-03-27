import errorHandler from '../middleware/errorHandles';
import fileRouter from './fileRoute/fileRoute';
function routes(app: any) {
    app.use('/api/v1/files', fileRouter);
    app.use(errorHandler);
}
export default routes;
