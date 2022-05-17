import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResourceTypeSetDto {
	@ApiProperty({ example: 1, description: '添加资源分类名称', name: 'name' })
	@IsNotEmpty({ message: '分类名称不能为空' })
	name: string;
}
