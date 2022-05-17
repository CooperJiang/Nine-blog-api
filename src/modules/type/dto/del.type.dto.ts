import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TypeDelDto {
	@ApiProperty({ example: 1, description: '删除分类的id', name: '分类id' })
	@IsInt({ message: '传入参数类型错误！' })
	id: string;
}
