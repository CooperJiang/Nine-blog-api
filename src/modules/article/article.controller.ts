import { ArticleReadDto } from './dto/read.article.dto';
import { ArticleSetDto } from './dto/set.article.dto';
import { ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { Controller, Post, Get, Body, Query, Request, Response } from '@nestjs/common';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Post('/set')
	set(@Body() params: ArticleSetDto) {
		// set(@Body() params) {
		return this.articleService.set(params);
	}

	@Get('/query')
	query(@Query() params) {
		return this.articleService.query(params);
	}

	@Post('/del')
	del(@Body() params) {
		return this.articleService.del(params);
	}

	@Get('/detail')
	detail(@Query() params, @Request() req) {
		return this.articleService.detail(params, req);
	}

	@Get('/hot')
	hot(@Query() {}) {
		return this.articleService.hot();
	}

	@Get('/read')
	read(@Query() params: ArticleReadDto) {
		return this.articleService.read(params);
	}
}
