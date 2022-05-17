import { ResourceSetDto } from './dto/resource.set.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResourceService } from './resource.service';
import { Controller, Post, Get, Body, Query } from '@nestjs/common';

@ApiTags('Resource')
@Controller('/resource')
export class ResourceController {
	constructor(private readonly resourceService: ResourceService) {}

	@Post('/set')
	set(@Body() params: ResourceSetDto) {
		return this.resourceService.set(params);
	}

	@Get('/query')
	query(@Query() params) {
		return this.resourceService.query(params);
	}

	@Post('/del')
	del(@Body() params) {
		return this.resourceService.del(params);
	}
}
