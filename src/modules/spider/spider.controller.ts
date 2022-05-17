import { urlMusicDto } from './dto/url.music.dto';
import { SpiderService } from './spider.service';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Body, Query } from '@nestjs/common';

// const html2md = require('html-to-md');
@ApiTags('Spider')
@Controller('/spider')
export class SpiderController {
	constructor(private readonly spiderService: SpiderService) {}

	@Get('/test')
	test(@Query() params: urlMusicDto) {
		return this.spiderService.test(params);
	}
}
