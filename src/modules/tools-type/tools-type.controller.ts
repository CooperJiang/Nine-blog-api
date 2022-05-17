import { ToolsTypeService } from './tools-type.service';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@ApiTags('ToolsType')
@Controller('/toolsType')
export class ToolsTypeController {
	constructor(private readonly toolsTypeService: ToolsTypeService) {}

	@Get('/query')
	query(@Query() params) {
		return this.toolsTypeService.query(params);
	}

	@Post('/set')
	set(@Body() params) {
		return this.toolsTypeService.set(params);
	}

	@Post('/del')
	del(@Body() params) {
		return this.toolsTypeService.del(params);
	}
}
