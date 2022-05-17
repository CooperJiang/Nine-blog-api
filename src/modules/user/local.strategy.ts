import { UserService } from 'src/modules/user/user.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly userService: UserService) {
		super();
	}

	async validate(username: string, password: string): Promise<any> {
		const user = await this.userService.validateUser(username, password);
		if (!user) {
			throw new HttpException(
				{ message: '账号或者密码错误！', error: 'please try again later.' },
				HttpStatus.BAD_REQUEST,
			);
		}
		return user;
	}
}
