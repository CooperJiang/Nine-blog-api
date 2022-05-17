import { CommentSetDto } from './dto/comment.set.dto';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { Controller, Post, Get, Body, Query, Request } from '@nestjs/common';
import { IpAddress } from 'src/decorator/ipAddress.guard';

@ApiTags('Comment')
@Controller('/comment')
export class CommentController {
	constructor(private readonly CommentService: CommentService) {}

	@Post('/set')
	set(@Body() params: CommentSetDto, @Request() req) {
		return this.CommentService.set(params, req);
	}

	@Get('/query')
	query(@Query() params) {
		return this.CommentService.query(params);
	}
}
