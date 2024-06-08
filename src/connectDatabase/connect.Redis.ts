import { Redis } from 'ioredis';

let client: Redis,
    statusConnectRedis = {
        CONNECT: 'connect',
        END: 'end',
        RECONNECT: 'reconnecting',
        ERROR: 'error',
    };
const handleEventConnection = (connectionRedis: Redis) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('ConnectionRedis - status: connecting ');
    });
    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('ConnectionRedis - status: disconnecting ');
    });
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('ConnectionRedis - status: reconnecting ');
    });
    connectionRedis.on(statusConnectRedis.ERROR, (error) => {
        console.log('ConnectionRedis - status: error ', error);
    });
};
const initRedis = () => {
    const instanceRedis = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
    });
    client = instanceRedis;
    handleEventConnection(instanceRedis);
};
const getRedis = () => client;
const closeRedis = () => client;
export { initRedis, getRedis, closeRedis };
