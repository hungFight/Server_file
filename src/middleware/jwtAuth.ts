import express from 'express';
import jwt from 'jsonwebtoken';
import ServerError from '../utils/errors/ServerError';
import { Redis } from 'ioredis';
import getMAC from 'getmac';
import { getRedis } from '../connectDatabase/connect.Redis';
// status = 0 is login again
// status = 9999 is server busy
// status = 8888 is Unauthorized
interface PropsRefreshToken {
    refreshToken: string;
    accept: boolean;
    mac: string;
    userId: string;
    status: { name: 'login' | 'logout'; dateTime: Date; ip: string }[];
    userAgent: string;
}

class JWTVERIFY {
    verifyToken = async (req: express.Request, res: any, next: express.NextFunction) => {
        try {
            const userId = req.cookies.k_user;
            const authHeader = req.signedCookies.tks;
            const IP_MAC = getMAC();
            const IP_USER = req.headers['user-agent'] ?? '';
            getRedis().get(userId + 'refreshToken', (err, dataRD) => {
                // save token into redis
                if (err) {
                    return res.status(404).json('Error getting refresh token: ' + err);
                }
                if (dataRD) {
                    const newDataD: PropsRefreshToken[] = JSON.parse(dataRD);
                    const newDataFiltered = newDataD.filter((g) => g.userId === userId && g.mac === IP_MAC);
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
                                    return res.status(403).json(error);
                                }
                            }
                        } else {
                            return res.status(401).json({ status: 0, message: "You're not authenticated!" });
                        }
                    } else {
                        return res.status(401).json({ status: 8888, message: 'Unauthorized!' });
                    }
                } else {
                    return res.status(401).json({ status: 0, message: 'Expires refreshToken!' });
                }
            });
        } catch (error) {
            next(error);
        }
    };
}
export default new JWTVERIFY();
