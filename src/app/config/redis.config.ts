import { createClient } from 'redis';
import envConfig from "./envConfig";
import {consolePrint} from "../utils/consolePrintFunction";



export const redisClient =  createClient({
    username: envConfig.redis_username,
    password: envConfig.redis_password,
    socket: {
        host: envConfig.redis_socket_host,
        port: Number(envConfig.redis_socket_port)
    }
});



redisClient.on('error', err => {
    consolePrint('Redis Client Error', err);
});



export const connectRedisDatabase = async () => {
    if (!redisClient.isOpen){
        await redisClient.connect();
        consolePrint('✅ Redis Database Client Connected Successfully');
    }
}
