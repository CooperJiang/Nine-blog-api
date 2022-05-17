import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LinksSetDto {
	@ApiProperty({ example: 1, description: '友链' })
	@IsNotEmpty({ message: '友链不能为空' })
	name: string;

	@ApiProperty({ example: 'http://xxxx.png', description: '添加友链头像logo', required: true })
	avatar: string;

	@ApiProperty({ example: 'http://xxxx.com', description: '添加友链地址' })
	@IsNotEmpty({ message: '友链地址不能为空' })
	url: string;

	@ApiProperty({ example: '一个vue的博客', description: '友链描述简介' })
	@IsNotEmpty({ message: '请填写友链描述简介' })
	desc: string;

	@ApiProperty({
		example: 1,
		description: '友链状态, 1:正常，-1:冻结',
		required: true,
		enum: [1, -1],
		name: 'status',
	})
	@IsOptional()
	@IsEnum([1, -1], { message: '状态传入参数错误' })
	@Type(() => Number)
	status: number;

	@ApiProperty({ example: 1, description: '自定义排序数字,数字越大越靠前', required: false })
	orderId: number;
}
