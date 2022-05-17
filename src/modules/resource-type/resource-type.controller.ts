import { ResourceTypeSetDto } from './dto/resourceType.set.dto';
import { ResourceTypeService } from './resource-type.service';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Query, Get } from '@nestjs/common';

@ApiTags('ResourceType')
@Controller('/resourceType')
export class ResourceTypeController {
	constructor(private readonly resourceTypeService: ResourceTypeService) {}

	@Post('/set')
	set(@Body() params: ResourceTypeSetDto) {
		return this.resourceTypeService.set(params);
	}

	@Get('/query')
	query(@Query() params) {
		return this.resourceTypeService.query(params);
	}

	@Get('/queryAll')
	queryAll(@Query() params) {
		return this.resourceTypeService.queryAll(params);
	}

	@Post('/del')
	del(@Body() params) {
		return this.resourceTypeService.del(params);
	}
}
