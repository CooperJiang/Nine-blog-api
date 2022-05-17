import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TagSetDto {
	@ApiProperty({ example: 'Vue', description: '标签名称' })
	@IsNotEmpty({ message: '标签名称不能为空' })
	@MaxLength(9, { message: '标签最长不能超过9位' })
	name: string;
}
