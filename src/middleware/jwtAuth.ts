import express from 'express';
import jwt from 'jsonwebtoken';
import ServerError from '../utils/errors/ServerError';
import { Redis } from 'ioredis';
import getMAC from 'getmac';
// status = 0 is login again
// status = 9999 is server busy
// status = 8888 is Unauthorized
function deleteToken(res: express.Response) {
    console.log('delete coookies');
    res.clearCookie('tks');
    res.clearCookie('k_user');
}
class JWTVERIFY {
    verifyToken = async (req: express.Request, res: any, next: express.NextFunction) => {
        try {
            const userId = req.cookies.k_user;
            const authHeader = req.cookies.tks;
            const IP_MAC = getMAC();
            const redisClient: Redis = res.redisClient;
            const IP_USER = req.headers['user-agent'] ?? '';
            redisClient.get(userId + 'refreshToken', (err, dataRD) => {
                // save token into redis
                if (err) {
                    return res.status(404).json('Error getting refresh token: ' + err);
                }
                if (dataRD) {
                    const newDataD: {
                        refreshToken: string;
                        accept: boolean;
                        ip: string;
                        mac: string;
                        id_user: string;
                    }[] = JSON.parse(dataRD);
                    const newDataFiltered = newDataD.filter((g) => g.id_user === userId && g.mac === IP_MAC);
                    if (newDataFiltered.length) {
                        const dataRes = newDataFiltered[0];
                        const my = dataRes.refreshToken.split('@_@');
                        const [refreshToken, code] = my;
                        if (authHeader && userId && refreshToken) {
                            const tokenc = authHeader && authHeader.split(' ')[1];
                            if (!tokenc) {
                                return res.status(401).json({ status: 8888, message: 'Unauthorized!' });
                            } else {
                                try {
                                    jwt.verify(tokenc, code, (err: any, user: any) => {
                                        // user: {id:string;  iat: number; exp: number}
                                        console.log(user);

                                        if (user?.id !== userId || err) {
                                            return res.status(403).json({ status: 0, message: 'Token is not valid' });
                                        }
                                        jwt.verify(refreshToken, code, (err, data: any) => {
                                            // data: {id:string;iat: number; exp: number}
                                            if (data.id === userId && dataRes.accept && !err) {
                                                next();
                                            } else {
                                                return res.status(401).json({ status: 8888, message: 'Unauthorized!' });
                                            }
                                        });
                                    });
                                } catch (error) {
                                    console.log(error);
                                    return res.status(403);
                                }
                            }
                        } else {
                            deleteToken(res);
                            return res.status(401).json({ status: 0, message: "You're not authenticated!" });
                        }
                    } else {
                        deleteToken(res);
                        return res.status(401).json({ status: 8888, message: 'Unauthorized!' });
                    }
                } else {
                    deleteToken(res);
                    return res.status(401).json({ status: 0, message: 'Expires refreshToken!' });
                }
            });
        } catch (error) {
            next(error);
        }
    };
}
export default new JWTVERIFY();
