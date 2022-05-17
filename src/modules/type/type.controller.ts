import { TypeDelDto } from './dto/del.type.dto';
import { TypeSetDto } from './dto/set.type.dto';
import { TypeService } from './type.service';
import { Body, Query, Controller, Post, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Type')
@Controller('type')
export class TypeController {
	constructor(private readonly typeService: TypeService) {}

	@Post('/set')
	set(@Body() params: TypeSetDto) {
		return this.typeService.set(params);
	}

	@Get('/query')
	query(@Query() params) {
		return this.typeService.query(params);
	}

	@Post('/del')
	del(@Body() params: TypeDelDto) {
		return this.typeService.del(params);
	}
}
