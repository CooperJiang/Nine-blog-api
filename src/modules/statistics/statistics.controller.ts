import { ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { Controller, Post, Get, Body, Query } from '@nestjs/common';

@ApiTags('Statisics')
@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}
	@Get('/visit')
	query(@Query() params) {
		return this.statisticsService.visit(params);
	}

	@Get('/typeInfo')
	typeInfo() {
		return this.statisticsService.typeInfo();
	}

	@Get('/summary')
	summary() {
		return this.statisticsService.summary();
	}
}
