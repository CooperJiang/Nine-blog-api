import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createUpdateRoomInfoDto {
	// @ApiProperty({ example: '555', description: '房间ID', required: false })
	// @MinLength(3, { message: '房间ID长度最短为3' })
	// @MaxLength(3, { message: '房间ID长度最长为3' })
	// roomId: number;

	@ApiProperty({ example: '555', description: '房间名称', required: false })
	@MinLength(2, { message: '房间名称长度最短为2' })
	@MaxLength(14, { message: '房间名称长度最长为14' })
	roomName: string;

	@ApiProperty({ example: '555', description: '房间公告', required: false })
	@MaxLength(300, { message: '房间公告长度最长为300' })
	roomNotice: string;
}
