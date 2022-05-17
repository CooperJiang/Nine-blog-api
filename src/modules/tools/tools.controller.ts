import { toolsDouyinDto } from './dto/tools.douyin.dto';
import { ToolsService } from './tools.service';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query, Response } from '@nestjs/common';

@ApiTags('Tools')
@Controller('tools')
export class ToolsController {
	constructor(private readonly toolsService: ToolsService) {}

	@Get('/query')
	query(@Query() params) {
		return this.toolsService.query(params);
	}

	@Post('/set')
	set(@Body() params) {
		return this.toolsService.set(params);
	}

	@Post('/del')
	del(@Body() params) {
		return this.toolsService.del(params);
	}

	@Get('/douyin')
	douyin(@Query() params: toolsDouyinDto) {
		return this.toolsService.douyin(params);
	}

	@Get('/douyinload')
	douyinload(@Query() params: toolsDouyinDto, @Response() res) {
		return this.toolsService.douyinload(params, res);
	}
}
