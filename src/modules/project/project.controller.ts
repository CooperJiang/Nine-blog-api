import { ProjectSetDto } from './dto/project.set.dto';
import { ProjectService } from './project.service';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query, Body } from '@nestjs/common';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
	constructor(private readonly ProjectService: ProjectService) {}

	@Post('/set')
	set(@Body() params: ProjectSetDto) {
		return this.ProjectService.set(params);
	}

	@Get('/query')
	query(@Query() params) {
		return this.ProjectService.query(params);
	}

	@Post('/del')
	del(@Body() params) {
		return this.ProjectService.del(params);
	}
}
