import { CollectEntity } from './../collect/collect.entity';
import { RoomEntity } from './room.entity';
import { UserEntity } from './../user/user.entity';
import { MusicService } from './../music/music.service';
import { MusicEntity } from './../music/music.entity';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { verifyToken } from 'src/utils/verifyToken';
import { formatOnlineUser } from 'src/utils/tools';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRandomIntInclusive } from '../../constant/avatar';
import { MessageEntity } from './message.entity';
import { getTimeSpace } from '../../utils/tools';
/**
 * @desc ws
 *  1.client.emit('online', 'xxx'); 给当前建立连接的用户广播
 *  2.client.broadcast.emit('online', 'xxx'); 给除了当前用户的其他人广播
 *  3.this.socket.emit('online', 'xxx'); 给包含当前用户的所有人广播
 */
@WebSocketGateway(3002, {
	path: '/chat',
	allowEIO3: true,
	// cors: true,
	cors: {
		origin: /.*/,
		credentials: true,
	},
})
export class WsChatGateway {
	constructor(private readonly MusicService: MusicService) {}

	private logger: Logger = new Logger('ChatGateway');
	@WebSocketServer() private socket: Server; // socket实例
	@InjectRepository(MusicEntity)
	private readonly MusicModel: Repository<MusicEntity>;
	@InjectRepository(MessageEntity)
	private readonly MessageMode: Repository<MessageEntity>;
	@InjectRepository(CollectEntity)
	private readonly CollectMode: Repository<CollectEntity>;
	@InjectRepository(UserEntity)
	private readonly UserModel: Repository<UserEntity>;
	@InjectRepository(RoomEntity)
	private readonly RoomModel: Repository<RoomEntity>;
	private clientIdMap: any = {}; //  记录clientId和userId
	private onlineUserInfo: any = {}; // 全房间在线用户信息，方便拿到单个用户具体信息
	private chooseMusicTimeSpace: any = {}; // 记录每位用户的点歌时间
	private maxCustomId = 0; // 歌曲有多少首，取这个区间的随机数拿歌曲
	private roomList = {}; // 管理一个所有房间的房间信息

	private init = async () => {
		const res = await this.MusicModel.query(`select max(customId) as max from tb_music`);
		this.maxCustomId = res[0].max;
	};

	private autoFn = async () => {
		try {
			await this.inspectorChat();
			// await this.switchMusic();
		} catch (error) {
			return this.autoFn();
		}
	};

	/* 初始化websocket init ... */
	async afterInit() {
		await this.init();
		this.autoFn();
	}

	/**
	 * @desc 客户端建立连接后首先验证token是否有效，token校验通过后校验用户是否在线，再记录用户与房间关联的所有信息
	 * @param client
	 * @returns
	 */
	async handleConnection(client: Socket): Promise<any> {
		const { token, address, roomId } = client.handshake.query;
		const payload = await verifyToken(token); // 可能会校验失败 校验失败的时候拿不到userId
		const { userId } = payload;
		if (userId === -1 || !token) {
			client.emit('authFail', { code: -1, msg: '权限校验失败，请重新登录' });
			return client.disconnect();
		}
		const u = await this.UserModel.findOne({ id: userId });
		const { username, nickname, email, role, avatar, sign, roomBg } = u;
		const userInfo = { username, nickname, email, role, avatar, sign, roomBg, userId };
		const isHasUser = this.onlineUserInfo[userId];
		/* 如果存在这个用户 先告知老的用户被挤掉 踢掉之前加入的那位  */
		if (isHasUser) {
			const { uuid } = isHasUser;
			/* 通知新老用户 */
			this.socket.to(uuid).emit('tips', { code: -2, msg: '您的账户在别地登录了，您已被迫下线' });
			client.emit('tips', { code: -1, msg: '您的账户已在别地登录，已为您覆盖登录！' });
			/* 踢掉老的用户 */
			this.socket.in(uuid).disconnectSockets(true);
		}
		const roomInfo = await this.RoomModel.findOne({ where: { roomId } });
		if (!roomInfo) {
			client.emit('tips', { code: -1, msg: '您正在尝试加入一个不存在的房间、非法操作！！！' });
			return client.disconnect();
		}
		const onlineRoomIds: any = Object.keys(this.roomList).map((roomId) => Number(roomId));
		if (onlineRoomIds.length > 5 && !onlineRoomIds.includes(Number(roomId))) {
			client.emit('disableJoin', {
				code: -1,
				msg: '由于服务器资源有限，房主限制最多在线五个房间，请耐心等候或加入他人房间吧！',
			});
			return client.disconnect();
		}
		client.join(roomId);
		/* 记录房间信息 */
		!this.roomList[Number(roomId)] && (await this.initBasicRoomInfo(roomId, roomInfo));
		this.roomList[Number(roomId)].onlineUserList.push(userInfo);
		/* uuid: 唯一通信id  */
		this.onlineUserInfo[userId] = { userInfo, roomId, uuid: client.id }; // 在线信息同时记录房间号
		this.clientIdMap[client.id] = userId; // 通过clientId 映射到 userId
		this.joinRoomSuccess(client, userId, nickname, address, roomId);
	}

	/**
	 * @desc 断开连接时需要干嘛
	 * 	1. 拿到用户信息和用户所在房间信息 并把该用户从全局在线信息中移除
	 * 	2. 移除此用户，并且下放通过变更当前房间在线用户的在线用户信息
	 * 	3. 检测当前房间剩余人数，如果当前房间人数为0，则删除此房间在线状态
	 * 		 如果房间还有人，就再次更新房间在线列表
	 * @param client
	 */
	handleDisconnect(client: Socket) {
		const userId = this.clientIdMap[client.id];
		const user = this.onlineUserInfo[userId];
		if (!user) return;
		const { userInfo, roomId } = user;
		const { nickname } = userInfo;
		const delUserIndex = this.roomList[Number(roomId)].onlineUserList.findIndex((t) => t.userId === userId);
		this.roomList[Number(roomId)].onlineUserList.splice(delUserIndex, 1);
		delete this.onlineUserInfo[userId];
		if (!this.roomList[Number(roomId)].onlineUserList.length && Number(roomId) !== 888) {
			return delete this.roomList[Number(roomId)];
		}
		const onLineUserInfo = formatOnlineUser(this.roomList[Number(roomId)].onlineUserList);
		this.socket.to(roomId).emit('offline', { code: 1, data: onLineUserInfo, msg: `${nickname}离开房间了` });
	}

	/* 查询在线人数 */
	@SubscribeMessage('query')
	handleQueryOnline(client: Socket, data: any): void {
		const onLineUserInfo = formatOnlineUser(this.onlineUserInfo);
		client.emit('query', { data: onLineUserInfo, type: data, msg: '查询信息完成' });
	}

	/* 接收到客户端的消息 */
	@SubscribeMessage('message')
	async handleMessage(client: Socket, data: any) {
		const { type, content } = data;
		const userId = this.clientIdMap[client.id];
		const user = this.onlineUserInfo[userId];
		const { userInfo, roomId } = user;
		const params = { userId, content, type, roomId };
		const res = await this.MessageMode.save(params);
		const { id } = res;
		this.socket.to(roomId).emit('message', {
			data: { type, content, userId, id, userInfo, createdAt: new Date() },
			msg: '有一条新消息',
		});
	}

	/* 用户修改个人信息，db查找新资料更新到在线列表 */
	@SubscribeMessage('updateUserInfo')
	async handleUpdateUserInfo(client: Socket, data: any) {
		const userId = this.clientIdMap[client.id];
		const user = this.onlineUserInfo[userId];
		const { roomId } = user;
		const u = await this.UserModel.findOne({
			where: { id: userId },
			select: ['username', 'nickname', 'email', 'avatar', 'role', 'roomBg', 'sign'],
		});
		const { username, nickname, email, avatar, role, roomBg, sign } = u;
		this.onlineUserInfo[userId] = { username, nickname, email, avatar, role, roomBg, sign };
		const onlineUserInfo = formatOnlineUser(this.onlineUserInfo);
		this.socket.to(roomId).emit('online', { code: 1, data: onlineUserInfo, msg: `${nickname}更新了个人信息` });
	}

	/* 点击收藏音乐 */
	@SubscribeMessage('collectMusic')
	async handlerCollectMusic(client: Socket, data: any) {
		const musicInfo = data.data;
		const { userId, mid } = data.data;
		const c = await this.CollectMode.count({ where: { userId, mid } });
		if (c > 0) {
			const data = { code: -1, msg: '您已经收藏过这首歌了！' };
			client.emit('collectMusic', data);
		} else {
			musicInfo.typeId = 1;
			await this.CollectMode.save(musicInfo);
			const data = { code: 1, msg: '恭喜您收藏成功' };
			client.emit('collectMusic', data);
		}
	}

	/* 点歌操作  */
	@SubscribeMessage('chooseMusic')
	async handlerChooseMusic(client: Socket, musicInfo: any) {
		const userId = this.clientIdMap[client.id];
		const user = this.onlineUserInfo[userId];
		const { userInfo, roomId } = user;
		const { musicQueueList } = this.roomList[Number(roomId)];
		const { name, artist, mid } = musicInfo;
		if (musicQueueList.some((t) => t.mid === mid)) {
			return client.emit('tips', { code: -1, msg: '这首歌已经在列表中啦！' });
		}
		/* 计算距离上次点歌时间 */
		if (this.chooseMusicTimeSpace[userId]) {
			const timeDifference = getTimeSpace(this.chooseMusicTimeSpace[userId]);
			/* 点歌权限控制在这里更改， 可以抽离出去 */
			if (timeDifference <= 15 && !['super', 'guest', 'admin'].includes(userInfo.role)) {
				return client.emit('tips', { code: -1, msg: `频率过高 请在${15 - timeDifference}秒后重试` });
			}
		}
		musicInfo.userInfo = userInfo;
		musicQueueList.push(musicInfo);
		this.chooseMusicTimeSpace[userId] = getTimeSpace();
		client.emit('tips', { code: 1, msg: '恭喜您点歌成功' });
		this.socket.to(roomId).emit('chooseMusic', {
			code: 1,
			data: musicQueueList,
			msg: `${userInfo.nickname} 点了一首 ${name}(${artist})`,
		});
	}

	/* 移除已点歌曲  */
	@SubscribeMessage('removeQueueMusic')
	async handlerRemoveQueueMusic(client: Socket, data: any) {
		const userId = this.clientIdMap[client.id];
		const { mid, name, artist, userInfo } = data;
		if (userId !== userInfo.userId) {
			return client.emit('tips', { code: -1, msg: '只能移除掉自己点的歌曲哟...' });
		} else {
			const user = this.onlineUserInfo[userId];
			const { userInfo, roomId } = user;
			const { musicQueueList } = this.roomList[Number(roomId)];
			const index = musicQueueList.findIndex((t) => t.mid === mid);
			musicQueueList.splice(index, 1);
			this.socket.to(roomId).emit('chooseMusic', {
				code: 1,
				data: musicQueueList,
				msg: `${userInfo.nickname} 移除了歌单中的 ${name}(${artist})`,
			});
		}
	}

	/* 切歌操作  */
	@SubscribeMessage('cutMusic')
	async handlerCutMusic(client: Socket, data: any) {
		const userId = this.clientIdMap[client.id];
		const user = this.onlineUserInfo[userId];
		const { userInfo, roomId } = user;
		const { role, nickname } = userInfo;
		/* 需要权限逻辑在这里控制 */
		// if (!['super', 'guest', 'admin'].includes(role)) {
		// 	return client.emit('tips', { code: -1, msg: '当前切歌只对管理员开放哟！' });
		// }
		client.emit('tips', { code: 1, msg: '当前房间已允许所有人切歌' });
		const { currentMusicInfo } = this.roomList[Number(roomId)];
		const { album, artist } = currentMusicInfo;
		await this.sendNotice(roomId, { type: 'info', content: `${nickname} 切掉了 ${album}(${artist})` });
		this.switchMusic(roomId);
	}

	/* 撤回消息  */
	@SubscribeMessage('recallMessafe')
	async handlerRecallMessafe(client: Socket, data: any) {
		const { id, nickname } = data;
		const userId = this.clientIdMap[client.id];
		const user = this.onlineUserInfo[userId];
		const { roomId } = user;
		const message = await this.MessageMode.findOne({ id, userId });
		if (!message) {
			return client.emit('tips', { code: -1, msg: '非法操作，不可移除他人消息！' });
		}
		const { createdAt } = message;
		const timeSpace = new Date(createdAt).getTime();
		const now = new Date().getTime();
		if (now - timeSpace > 2 * 60 * 1000) {
			return client.emit('tips', { code: -1, msg: '只能撤回两分钟内的消息哟！' });
		}
		await this.MessageMode.update({ id }, { status: -1 });
		this.socket.to(roomId).emit('recallMessafe', { code: 1, data: id, msg: `${nickname} 撤回了一条消息` });
		// await this.sendNotice({ type: 'info', content: `${nickname} 撤回了一条消息` });
	}

	/* 推荐房间列表  */
	// @SubscribeMessage('recommendRoom')
	// async handlerRecommendRoom(client: Socket) {
	// 	const roomList = this.formatRoomList();
	// 	client.emit('recommendRoom', roomList);
	// }

	/* 修改房间信息  */
	@SubscribeMessage('updateRoomInfo')
	async handlerUpdateRoomInfo(client: Socket, roomId) {
		const roomInfo = await this.RoomModel.findOne({ where: { roomId } });
		delete roomInfo.createdAt;
		delete roomInfo.updatedAt;
		delete roomInfo.deletedAt;
		if (!this.roomList[roomId]) return;
		this.roomList[roomId].roomInfo = roomInfo;
		const roomList = this.formatRoomList();
		client.emit('recommendRoom', roomList);
	}

	/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

	/* 到点切换音乐 */
	async switchMusic(roomId) {
		const { mid, userInfo, currentRoomMusicQueueList } = await this.getNextMusicMid(roomId);
		try {
			const { musicInfo, lrclist: musicLrc } = await this.MusicService.musicInfo({ mid });
			const musicSrc = await this.MusicService.musicUrl({ mid });
			this.roomList[Number(roomId)].currentMusicInfo = musicInfo;
			this.roomList[Number(roomId)].musicLrc = musicLrc;
			this.roomList[Number(roomId)].musicSrc = musicSrc;
			currentRoomMusicQueueList.shift(); // 移除掉队列的第一首歌
			const { album, artist } = musicInfo;
			this.socket.to(roomId).emit('switchMusic', {
				data: {
					musicInfo,
					musicSrc,
					musicLrc,
					queueMusicList: currentRoomMusicQueueList,
				},
				msg: `正在播放${userInfo ? userInfo.nickname : '系统随机'}点播的 ${album}(${artist})`,
			});
			const { duration } = musicInfo;
			this.roomList[Number(roomId)].nextMusicTimespace = new Date().getTime() + duration * 1000;
		} catch (error) {
			currentRoomMusicQueueList.shift(); // 移除掉队列的第一首歌
			this.switchMusic(roomId);
			return this.sendNotice(roomId, { type: 'info', content: `当前歌曲加载失败、试试其他歌曲吧！` });
		}
	}

	/**
	 * @desc  告知客户端已经成功加入房间，并返回当前房间具体信息 客户端请求房间基础信息进行整合
	 * @param userId 用户Id
	 * @param nickname 用户昵称
	 * @param roomId 房间Id
	 */
	joinRoomSuccess(client, userId, nickname, address, roomId) {
		const { currentMusicInfo, musicQueueList, musicSrc, musicLrc, onlineUserList, nextMusicTimespace } =
			this.roomList[Number(roomId)];
		const { duration } = currentMusicInfo;
		const startTime = duration - Math.round((nextMusicTimespace - new Date().getTime()) / 1000);

		const formatUserList = formatOnlineUser(onlineUserList);
		client.emit('joinRoomSuccess', {
			userId,
			musicSrc,
			currentMusicInfo,
			musicLrc,
			musicQueueList,
			onlineUserList: formatUserList,
			startTime,
			msg: `欢迎${nickname}加入房间！`,
		});
		/* 新用户上线通知房间其他人 */
		this.socket
			.to(roomId)
			.emit('newUserOnline', { onlineUserList: formatUserList, msg: `来自${address}的${nickname}进入了房间` });
		const roomList = this.formatRoomList();
		this.socket.emit('recommendRoom', roomList);
	}

	/**
	 * @desc 队列有音乐优先播放队列，队列没有从数据库随机拿一首
	 * @returns
	 */
	async getNextMusicMid(roomId) {
		let mid: any;
		let userInfo: any = null;
		let musicQueueList = [];
		this.roomList[Number(roomId)] && (musicQueueList = this.roomList[Number(roomId)].musicQueueList);
		if (musicQueueList.length) {
			mid = musicQueueList[0].mid;
			userInfo = musicQueueList[0]?.userInfo;
		} else {
			const customId = getRandomIntInclusive(1, this.maxCustomId);
			const res = await this.MusicModel.findOne({ customId });
			mid = res.mid;
		}
		return { mid, userInfo, currentRoomMusicQueueList: musicQueueList };
	}

	/**
	 * @desc 发送给客户端全局通知或者公告
	 * @param param0
	 */
	sendNotice(roomId, { type, content }) {
		this.socket.to(roomId).emit('notice', { type, content });
	}

	/**
	 * @desc 初始化单个房间信息
	 * @param roomId 房间Id
	 * @returns 如果房间是进入第一个人就初始化房间所需基本信息
	 */
	async initBasicRoomInfo(roomId, roomInfo) {
		delete roomInfo.createdAt;
		delete roomInfo.updatedAt;
		delete roomInfo.deletedAt;
		delete roomInfo.id;
		const { roomUserId } = roomInfo;
		const roomAdminInfo = await this.UserModel.findOne({
			where: { id: roomUserId },
			select: ['nickname', 'avatar'],
		});
		this.roomList[Number(roomId)] = {
			onlineUserList: [],
			musicQueueList: [],
			currentMusicInfo: [],
			nextMusicTimespace: null,
			musicSrc: null,
			musicLrc: null,
			[`timer${roomId}`]: null,
			roomInfo,
			roomAdminInfo,
		};
		await this.switchMusic(roomId);
	}

	/**
	 * @desc 重复检测各个房间是否需要切歌了，到时间就切换,
	 * 			 初始化的时候执行
	 */
	async inspectorChat() {
		setInterval(() => {
			if (!Object.keys(this.roomList).length) return;
			Object.keys(this.roomList).forEach((roomId) => {
				const { nextMusicTimespace } = this.roomList[roomId];
				const nowTimespace = new Date().getTime();
				nowTimespace >= nextMusicTimespace && this.switchMusic(roomId);
			});
		}, 5000);
	}

	/**
	 * @desc 格式化房间列表信息
	 */
	formatRoomList() {
		const cloneData = JSON.parse(JSON.stringify(this.roomList));
		const formatRoomList = [];
		Object.keys(cloneData).forEach((roomId) => {
			const { onlineUserList, roomAdminInfo, roomInfo } = cloneData[roomId];
			const { roomName, roomNotice, roomNeedPassword, roomLogo } = roomInfo;
			formatRoomList.push({
				onlineUserNums: onlineUserList.length,
				roomName,
				roomNotice,
				roomLogo,
				roomId,
				isNeedPassword: roomNeedPassword,
				roomAdminNick: roomAdminInfo.nickname,
			});
		});
		return formatRoomList;
	}
}
