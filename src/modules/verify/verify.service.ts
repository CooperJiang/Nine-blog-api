import { UserEntity } from './../user/user.entity';
import { VerifyEntity } from './verify.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VerifyService {
	constructor(
		@InjectRepository(VerifyEntity)
		private readonly VerifyModle: Repository<VerifyEntity>,
		@InjectRepository(UserEntity)
		private readonly UserModle: Repository<UserEntity>,
	) {}

	async accountActive(params, res) {
		const { code, email } = params;
		const verify = await this.VerifyModle.findOne({
			where: { code, email },
		});
		const user = await this.UserModle.findOne({ where: { email } });
		const { nickname, id } = user;
		if (!verify) {
			await this.UserModle.delete({ id });
			res.redirect(`/api/verify/verifyError`);
			// throw new HttpException("激活失败、检查您的邮箱和验证码！", HttpStatus.BAD_REQUEST)
		} else {
			const { expirationTime } = verify;
			const now = new Date().getTime();

			const isExpire = now - Number(expirationTime) < 0;
			if (isExpire) {
				await this.UserModle.update({ id }, { status: 1 });
				res.redirect(`/api/verify/verifySuccess?nickname=${nickname}&count=${id}`);
			} else {
				await this.UserModle.delete({ id });
				res.redirect(`/api/verify/verifyError`);
				// throw new HttpException("您的验证码已过期、请重新注册！", HttpStatus.BAD_REQUEST)
			}
		}
	}
}
