import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class collectSetDto {
	@ApiProperty({ example: '1', description: '收藏东西的类型' })
	@IsNotEmpty({ message: '收藏类型不能为空！' })
	typeId: number;

	@ApiProperty({ example: '1', description: '文章Id', required: false })
	articleId: number;

	@ApiProperty({ example: '1', description: '工具Id', required: false })
	toolId: number;

	@ApiProperty({ example: '1', description: '音乐Id', required: false })
	mid: number;

	@ApiProperty({ example: '1', description: '资源导航Id', required: false })
	resourceId: number;

	@ApiProperty({ example: '1', description: '项目Id', required: false })
	projectId: number;

	@ApiProperty({ example: '1', description: '点赞或者取消点赞 1|0', required: false })
	@IsOptional()
	@IsEnum([1, 0], { message: '状态参数非法' })
	@Type(() => Number)
	isLike: number;
}
