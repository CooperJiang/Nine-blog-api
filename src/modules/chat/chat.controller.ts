import { createUpdateRoomInfoDto } from './dto/room.dto';
import { ChatService } from './chat.service';
import { Controller, Get, Post, Query, Body, Req, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { emoticonSearchDto, roomInfoDto } from './dto/search.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
	constructor(private readonly ChatService: ChatService) {}

	@Get('/history')
	history(@Query() params) {
		return this.ChatService.history(params);
	}

	@Get('/emoticon')
	emoticon(@Query() params: emoticonSearchDto) {
		return this.ChatService.emoticon(params);
	}

	@Get('/roomInfo')
	roomInfo(@Query() params: roomInfoDto) {
		return this.ChatService.roomInfo(params);
	}

	@Post('/updateRoom')
	updateRoom(@Body() params, @Request() req) {
		return this.ChatService.updateRoom(params, req.payload);
	}

	@Post('/createRoom')
	createRoom(@Body() params: createUpdateRoomInfoDto, @Request() req) {
		return this.ChatService.createRoom(params, req.payload);
	}
}
