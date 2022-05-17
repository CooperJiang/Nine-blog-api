import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendEmail(text: string) {
		const res = await this.mailerService.sendMail({
			to: '927898639@qq.com',
			from: 'Nine_Team@163.com',
			subject: '来自Nine聊天室的注册验证',
			html: `<span style="padding:15px; display: flex; justify-content: center; flex-direction: column; background: #eee; width: 400px;border-radius: 15px;">
              <b>Nine Team 邮箱验证码</b>
              <p>请点下以下链接激活您的账号，<a href="https://baidu.com" style="color: #5ead22;">点此激活您的账号</a></p>
              <span style="padding: 0; font-size: 12px; color: #ccc;">来自 --小九的博客</span>
            </span>`,
			template: './welcome',
			// context: {
			//   // url: '',
			// },
		});
		return res;
	}
}
