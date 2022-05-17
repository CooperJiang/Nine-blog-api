import { RoomEntity } from './room.entity';
import { requestHtml } from './../../utils/spider';
import { UserEntity } from './../user/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MessageEntity } from './message.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(MessageEntity)
		private readonly MessageModel: Repository<MessageEntity>,
		@InjectRepository(UserEntity)
		private readonly UserModel: Repository<UserEntity>,
		@InjectRepository(RoomEntity)
		private readonly RoomModel: Repository<RoomEntity>,
	) {}

	async history(params) {
		const { page = 1, pagesize = 100, roomId } = params;
		const messageInfo = await this.MessageModel.find({
			where: { roomId },
			order: { id: 'DESC' },
			skip: (page - 1) * pagesize,
			take: pagesize,
		});
		const userIds = [];
		messageInfo.forEach((t) => !userIds.includes(t.userId) && userIds.push(t.userId));
		const userInfos = await this.UserModel.find({ where: { id: In(userIds) }, select: ['id', 'nickname', 'avatar'] });
		userInfos.forEach((t: any) => (t.userId = t.id));
		messageInfo.forEach((t: any) => (t.userInfo = userInfos.find((k: any) => k.userId === t.userId)));
		return messageInfo;
	}

	async emoticon(params) {
		const { keyword } = params;
		const url = `https://www.doutula.com/search?keyword=${encodeURIComponent(keyword)}`;
		const $ = await requestHtml(url);
		const list = [];
		$('.search-result .pic-content .random_picture a').each((index, node) => {
			const url = $(node).find('img').attr('data-original');
			url && list.push(url);
		});
		return list;
	}

	async roomInfo(params) {
		const { roomId } = params;
		return await this.RoomModel.findOne({
			where: { roomId },
			select: ['roomId', 'roomName', 'roomNotice', 'roomNeedPassword', 'roomLogo', 'roomBg'],
		});
	}

	async updateRoom(params, payload) {
		// TODO 刚刚创建token没有toomId  去tb_room拿 需要创建后交换新token
		const { userId } = payload;
		// const { roomId } = payload;
		// if (!roomId) {
		// 	throw new HttpException('非法操作、您还没开通个人房间！', HttpStatus.BAD_REQUEST);
		// }
		const room = await this.RoomModel.findOne({ where: { roomUserId: userId } });
		const { roomId } = room;
		const { roomName, roomNotice, roomLogo } = params;
		const updateData: any = {};
		roomName && (updateData.roomName = roomName);
		roomNotice && (updateData.roomNotice = roomNotice);
		roomLogo && (updateData.roomLogo = roomLogo);
		await this.RoomModel.update({ roomId }, updateData);
		return '修改房间信息成功！';
	}

	async createRoom(params, payload) {
		const { roomId, userId, avatar } = payload;
		const { roomName, roomId: newRoomId, roomNotice } = params;
		if (roomId) {
			throw new HttpException('非法操作、您已经有个人房间了！', HttpStatus.BAD_REQUEST);
		}
		const oldRoom = await this.RoomModel.count({ where: { roomId: newRoomId } });
		if (oldRoom) {
			throw new HttpException('当前房间号已经有人注册了、换个房间号吧！', HttpStatus.BAD_REQUEST);
		}
		await this.RoomModel.save({
			roomName,
			roomId: newRoomId,
			roomNotice,
			roomUserId: userId,
			roomLogo: avatar,
		});
		const res = await this.UserModel.update({ id: userId }, { roomId: newRoomId });
		return res;
	}
}
