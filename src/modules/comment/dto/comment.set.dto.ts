import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentSetDto {
	// @ApiProperty({ example: 1 , description: '用户id' })
	// @IsNotEmpty({ message: '用户id不能为空' })
	// userId: number;

	@ApiProperty({ example: '博主这篇文章写得很好啊，但是有这几点xxxx', description: '评论内容' })
	@IsNotEmpty({ message: '评论内容不能为空' })
	comment: string;

	@ApiProperty({ example: 1, description: '上一级的id，一级评论id', required: false })
	upId: string;

	@ApiProperty({ example: 1, description: '文章id', required: false })
	articleId: number;

	// @ApiProperty({ example: '188.35.62.4' , description: '评论的ip地址', required: false })
	// ip: number;

	// @ApiProperty({ example: '陕西省 西安市' , description: '上传地址', required: false })
	// address: string;
}
