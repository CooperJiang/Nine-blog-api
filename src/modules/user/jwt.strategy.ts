import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { secret } from 'src/config/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromHeader('token'),
			ignoreExpiration: false,
			secretOrKey: secret,
		});
	}

	async validate(payload: any) {
		return {
			userId: payload.userId,
			username: payload.username,
			email: payload.email,
		};
	}
}
