import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';

/* 暂时不抽离 */
export default {
	transport: {
		host: 'smtp.163.com',
		port: '465',
		auth: {
			user: 'Nine_Team@163.com',
			pass: 'PWFJMLSQVOBMQCQJ',
		},
	},
	from: 'Nine_Team@163.com',
	template: {
		dir: join(__dirname, '../templates/email/'),
		adapter: new PugAdapter(),
		options: {
			strict: true,
		},
	},
};
