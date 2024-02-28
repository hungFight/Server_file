import fileRouter from './fileRoute/fileRoute';
function routes(app: any) {
    app.use('/api/v1/files', fileRouter);
}
export default routes;
