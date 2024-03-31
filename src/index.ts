import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import routes from './routes';
import errorHandler from './middleware/errorHandles';
import { Redis } from 'ioredis';
import jwtAuth from './middleware/jwtAuth';
require('dotenv').config();
import ExcessiveRequests from './middleware/ExcessiveRequests';
const app = express();
const port = 3002;

app.use(cookieParser('123'));
app.use(
    cors({
        credentials: true,
        origin: [`${process.env.SERVERNODE_URL}`, 'http://localhost:3000'],
    }),
);
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use((req: any, res: any, next) => {
    res.redisClient = redisClient;
    next();
});
app.use(ExcessiveRequests.ip);
app.use(jwtAuth.verifyToken);
routes(app);
app.use(errorHandler);
app.listen({ port }, () => console.log(`Server is listening on http://localhost:${port}`));
