import { collectSetDto } from './dto/set.collect.dto';
import { CollectService } from './collect.service';
import { Controller, Post, Get, Body, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Collect')
@Controller('collect')
export class CollectController {
	constructor(private readonly collectService: CollectService) {}

	@Post('/set')
	set(@Body() params: collectSetDto, @Request() req) {
		return this.collectService.set(params, req);
	}
}
