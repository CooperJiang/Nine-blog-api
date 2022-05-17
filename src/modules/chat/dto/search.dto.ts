import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class emoticonSearchDto {
	@ApiProperty({ example: '大笑', description: '关键词', required: true })
	@IsNotEmpty({ message: '请输入您要搜索的表情包名称!' })
	keyword: string;
}

export class roomInfoDto {
	@ApiProperty({ example: 666, description: '房间ID', required: true })
	@IsNotEmpty({ message: '请填写房间ID!' })
	roomId: string;
}
