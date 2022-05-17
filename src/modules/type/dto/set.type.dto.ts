import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TypeSetDto {
	@ApiProperty({ example: 'Vue', description: '分类名称' })
	@IsNotEmpty({ message: '分类名称不能为空' })
	name: string;

	@ApiProperty({ example: 'vue', description: '分类英文简称，美化最终跳转路径' })
	@IsNotEmpty({ message: '分类英文简称不能为空' })
	value: string;

	@ApiProperty({ example: '这是vue汇总的分类', description: '关于分类的描述' })
	@IsNotEmpty({ message: '描述为必填项！' })
	@MaxLength(30, { message: '最多不超过30字！' })
	desc: string;
}
