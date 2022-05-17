import { ApiProperty } from '@nestjs/swagger';

export class ArticleReadDto {
	@ApiProperty({ example: 1, description: '文章ID' })
	id: number;
}
