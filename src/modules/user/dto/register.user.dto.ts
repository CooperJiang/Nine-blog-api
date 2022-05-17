import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserRegisterDto {
	@ApiProperty({ example: 'admin', description: '用户名' })
	@IsNotEmpty({ message: '用户名不能为空' })
	username: string;

	@ApiProperty({ example: '小九', description: '用户昵称' })
	@IsNotEmpty({ message: '用户昵称不能为空' })
	@MaxLength(8, { message: '用户昵称长度最多为8位' })
	nickname: string;

	@ApiProperty({ example: '123456', description: '密码' })
	@IsNotEmpty({ message: '密码不能为空' })
	@MinLength(6, { message: '密码长度最低为6位' })
	@MaxLength(30, { message: '密码长度最多为30位' })
	password: string;

	@ApiProperty({ example: '123456@qq.com', description: '邮箱' })
	@IsEmail({}, { message: '请填写正确格式的邮箱' })
	email: string;

	@ApiProperty({ example: true, description: '是否不使用邮箱验证' })
	isUseEmailVer: boolean;

	@ApiProperty({ example: 'https://www.xxxx.png', description: '头像', required: false })
	avatar: string;

	@ApiProperty({
		example: 1,
		description: '账号状态',
		required: false,
		enum: [1, 2],
	})
	@IsOptional()
	@IsEnum([1, 2], { message: 'sex只能是1或者2' })
	status: number;
}
