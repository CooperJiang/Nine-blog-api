import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });

export const secret = process.env.JWT_SECRET;
export const expiresIn = process.env.JWT_EXPIRESIN;

/* 目前权限相对简单，这里配置接口白名单，表示这些接口不是管理员也可以访问 */
export const whiteList = ['/api/user/login', '/api/user/register', '/api/upload/file'];
export const postWhiteList = [
	'/api/comment/set',
	'/api/user/update',
	'/api/chat/updateRoom',
	'/api/chat/createRoom',
	'api/collect/set',
];
