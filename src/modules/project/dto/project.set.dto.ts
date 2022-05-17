import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ProjectDto {
	@ApiProperty({ example: 1, description: '项目名称' })
	@IsNotEmpty({ message: '项目名称不能为空' })
	name: string;

	@ApiProperty({ example: 'http://xxxx.png', description: '项目卡片背景图' })
	@IsNotEmpty({ message: '背景图图片不能为空' })
	bgImage: string;

	@ApiProperty({ example: '一个关于xxx的项目。。。。', description: '项目介绍' })
	@IsNotEmpty({ message: '请填写友链描述简介' })
	desc: string;

	@ApiProperty({ example: '前端,vue', description: '项目标签 用,分割' })
	@IsNotEmpty({ message: '项目标签不能为空' })
	tag: string;

	@ApiProperty({ example: '2020-10-10', description: '项目开始时间' })
	@IsNotEmpty({ message: '项目开始时间不能为空' })
	startTime: string;

	@ApiProperty({ example: '2020-12-10', description: '项目结束时间' })
	@IsNotEmpty({ message: '项目结束时间不能为空' })
	endTime: string;

	@ApiProperty({ example: 'https://github/xxxx', description: '项目git地址', required: false })
	git: string;

	@ApiProperty({ example: 'https://xxxx/xxxx', description: '项目demo预览地址', required: false })
	link: string;

	@ApiProperty({
		example: 1,
		description: '是否推荐项目, 1:是 -1:否',
		required: true,
		enum: [1, -1],
		name: 'status',
	})
	@IsOptional()
	@IsEnum([1, -1], { message: 'hot传入参数错误' })
	@Type(() => Number)
	hot: number;

	@ApiProperty({
		example: 1,
		description: '项目类型, 1:外部地址，2:内部地址',
		required: true,
		enum: [1, 2],
		name: 'status',
	})
	@IsOptional()
	@IsEnum([1, -1], { message: '项目类型传入参数错误' })
	@Type(() => Number)
	type: number;

	@ApiProperty({
		example: 1,
		description: '项目状态, 1:正常，-1:冻结',
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

export class ProjectSetDto {
	@ApiProperty({ example: 1, description: '项目id' })
	id: number;

	@ApiProperty({ example: 1, description: '项目名称' })
	@ValidateNested()
	@Type(() => ProjectDto)
	data: ProjectDto;
}
