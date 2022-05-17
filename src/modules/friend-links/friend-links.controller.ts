import { LinksSetDto } from './dto/links.set.dto';
import { FriendLinksService } from './friend-links.service';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query, Body } from '@nestjs/common';

@ApiTags('FriendLinks')
@Controller('friend-links')
export class FriendLinksController {
	constructor(private readonly friendLinksService: FriendLinksService) {}

	@Post('/set')
	set(@Body() params: LinksSetDto) {
		return this.friendLinksService.set(params);
	}

	@Get('/query')
	query(@Query() params) {
		return this.friendLinksService.query(params);
	}

	@Post('/del')
	del(@Body() params) {
		return this.friendLinksService.del(params);
	}
}
