import { IsNotEmpty, IsInt, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ArticleSetDto {
	@ApiProperty({ example: '关于xxx的总结', description: '文章标题' })
	@IsNotEmpty({ message: '标题不能为空' })
	title: string;

	@ApiProperty({ example: '这是一篇关于xx的总结，主要讲述了。。。', description: '文章描述' })
	@IsNotEmpty({ message: '描述不能为空' })
	desc: string;

	@ApiProperty({ example: 'http://xxxxx.png', description: '文章封面图片' })
	@IsNotEmpty({ message: '封面图片不能为空' })
	coverImg: string;

	@ApiProperty({ example: 'http://xxxxx.mp3', description: '地址', required: false })
	bgMusic: string;

	@ApiProperty({ example: 1, description: '作者id' })
	@IsInt({ message: '作者Id参数类型错误' })
	userId: number;

	@ApiProperty({ example: 1, description: '排序Id 数字越大越靠前', required: false })
	orderId: number;

	// @ApiProperty({ example: '1,2', description: '标签id,[number]' })
	// @IsInt({ message: '标签id参数类型错误' })
	// tagId: string;

	@ApiProperty({ example: 1, description: '分类id' })
	@IsInt({ message: '分类id参数类型错误' })
	typeId: number;

	@ApiProperty({ example: '关于xxxxx', description: '文章主要内容' })
	content: string;

	@ApiProperty({
		example: 1,
		description: '文章状态,1:已发布，2:草稿',
		required: true,
		enum: [1, -1],
		name: 'status',
	})
	@IsOptional()
	@IsEnum([1, -1], { message: '状态参数非法' })
	@Type(() => Number)
	status: number;
}
