import { RedisModuleOptions } from 'nestjs-redis';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });

/* 暂时先不使用redis */
const redisOptions = {
	port: process.env.DEV_REDIS_PORT,
	host: process.env.DEV_REDIS_HOST,
	name: process.env.PRO_REDIS_USER,
	password: process.env.DEV_REDIS_PASS,
	db: 0,
};
export default redisOptions;
