import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class toolsDouyinDto {
	@ApiProperty({
		example: 'https://v.douyin.com/LFxv9ot/',
		description: '视频地址、点击右下角分享点击复制连接',
		required: true,
	})
	@IsNotEmpty({ message: '视频地址不能为空' })
	url: string;
}
