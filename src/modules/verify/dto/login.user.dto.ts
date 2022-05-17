import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountActiveDto {
	@ApiProperty({ example: '000000', description: '验证码', required: true })
	@IsNotEmpty({ message: '验证码不能为空' })
	code: number;

	@ApiProperty({ example: '123456@qq.com', description: '验证的邮箱', required: true })
	@IsNotEmpty({ message: '邮箱不能为空' })
	email: string;
}
