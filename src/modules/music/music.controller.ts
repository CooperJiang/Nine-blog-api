import { searchDto } from './dto/search.dto';
import { musicDto } from './dto/music.dto';
import { MusicService } from './music.service';
import { Controller, Injectable, Query, Get, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Music')
@Controller('music')
export class MusicController {
	constructor(private readonly musicService: MusicService) {}

	@Get('/url')
	musicUrl(@Query() params: musicDto) {
		return this.musicService.musicUrl(params);
	}

	@Get('/info')
	musicInfo(@Query() params: musicDto) {
		return this.musicService.musicInfo(params);
	}

	@Get('/hot')
	hot(@Query() params) {
		return this.musicService.hot(params);
	}

	@Get('/list')
	musicHotList(@Query() params: musicDto) {
		return this.musicService.musicHotList(params);
	}

	@Get('/search')
	search(@Query() params: searchDto) {
		return this.musicService.search(params);
	}

	@Get('/mv')
	searchMv(@Query() params: musicDto) {
		return this.musicService.searchMv(params);
	}

	@Get('/collect')
	collect(@Request() req, @Query() params) {
		return this.musicService.collect(req.payload, params);
	}

	@Get('/remove')
	remove(@Request() req, @Query() params) {
		return this.musicService.remove(req.payload, params);
	}
}
