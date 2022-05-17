import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResourceSetDto {
	@ApiProperty({ example: 1, description: '资源分类', name: 'resourceId' })
	@IsNotEmpty({ message: '资源分类不能为空' })
	resourceId: number;

	@ApiProperty({ example: 'http://xxxx.png', description: '资源LOGO', name: 'logo', required: false })
	logo: string;

	@ApiProperty({ example: 'vue', description: '添加资源名称', name: 'name' })
	@IsNotEmpty({ message: '资源名称不能为空' })
	name: string;

	@ApiProperty({ example: '这是一个前端框架', description: '添加资源描述', name: 'desc' })
	@IsNotEmpty({ message: '资源描述不能为空' })
	desc: string;

	@ApiProperty({ example: 'www.baidu.com', description: '添加资源指向地址', name: 'url' })
	@IsNotEmpty({ message: '资源指向地址不能为空' })
	url: string;

	@ApiProperty({ example: 1, description: '自定义排序数字', name: 'orderId', required: false })
	orderId: number;
}
