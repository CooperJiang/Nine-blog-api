import { CollectEntity } from './../collect/collect.entity';
import { SpiderService } from './../spider/spider.service';
import { InjectRepository } from '@nestjs/typeorm';
import { requestInterface, spiderKuWoHotMusic } from './../../utils/spider';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MusicEntity } from './music.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MusicService {
	constructor(
		@InjectRepository(MusicEntity)
		private readonly MusicModel: Repository<MusicEntity>,
		@InjectRepository(CollectEntity)
		private readonly CollectModel: Repository<CollectEntity>,
		private readonly SpiderService: SpiderService,
	) {}

	/* 通过mid查询歌曲地址 */
	async musicUrl(params) {
		const { mid } = params;
		const url = `https://www.kuwo.cn/api/v1/www/music/playUrl?mid=${mid}&type=music&httpsStatus=1&reqId=853eeac0-3d6f-11ec-928a-dfe06ab55d81`;
		const res: any = await requestInterface(url);
		if (res.code === 200) {
			return res.data.url;
		} else {
			throw new HttpException(`没有找到歌曲地址！`, HttpStatus.BAD_REQUEST);
		}
	}

	/* 通过mid查询歌曲详细信息不包含歌词用不上了 */
	async basemusicInfo(params) {
		const { mid } = params;
		const url = `https://www.kuwo.cn/api/www/music/musicInfo?mid=${mid}&httpsStatus=1&reqId=95974670-3eb3-11ec-8702-6df34f25d8f2`;
		const res: any = await requestInterface(url);
		if (res.code === 200) {
			const { artist, pic, pic120, duration, score100, album, songTimeMinutes, albuminfo, rid: mid } = res.data;
			return { artist, pic, pic120, duration, score100, album, songTimeMinutes, albuminfo, mid };
		} else {
			throw new HttpException(`没有找到歌曲信息！`, HttpStatus.BAD_REQUEST);
		}
	}

	/* 查询热门歌曲 */
	async hot(params) {
		const { page = 1, pagesize = 30 } = params;
		return await this.CollectModel.find({
			where: { userId: 1, typeId: 1 },
			order: { id: 'DESC' },
			skip: (page - 1) * pagesize,
			take: pagesize,
			cache: true,
		});
	}

	/* 查询歌曲详情包含歌词 */
	async musicInfo(params) {
		const { mid } = params;

		const musicInfoUrl = `https://www.kuwo.cn/api/www/music/musicInfo?mid=${mid}&httpsStatus=1&reqId=0b8cd740-409f-11ec-af85-c164fd2658ed`;
		const lrcUrl = `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${mid}`;

		const musicInfoData: any = await requestInterface(musicInfoUrl);
		const lrcData: any = await requestInterface(lrcUrl);
		if (lrcData.status === 200 && musicInfoData.code === 200) {
			const { lrclist } = lrcData.data;
			const { artist, pic120: pic, duration, score100, album, songTimeMinutes, rid: mid } = musicInfoData.data;
			return { lrclist, musicInfo: { artist, pic, duration, score100, album, songTimeMinutes, mid } };
		} else {
			throw new HttpException(`没有找到歌曲信息！`, HttpStatus.BAD_REQUEST);
		}
	}

	/* 查询搜索音乐 */
	async search(params) {
		const { keyword, page = 1, pagesize = 10 } = params;
		let musicList: any;
		try {
			const res: any = await this.SpiderService.searchMusic({ keyword, page, pagesize });
			if (res.code === 200) {
				musicList = res.data.list.map((t) => {
					const { rid: mid, duration, album, artist, albumpic, pic120, name, hasmv } = t;
					return { mid, duration, album, artist, albumpic, pic120, name, hasmv };
				});
			}
		} catch (error) {
			throw new HttpException(`没有搜索到歌曲`, HttpStatus.BAD_REQUEST);
		}
		return musicList;
	}

	/**
	 * @desc 部分拥有mv的歌曲可以通过mid拿到视频地址
	 */
	async searchMv(params) {
		const { mid } = params;
		return await this.SpiderService.searchMv(mid);
	}

	async collect(payload, params) {
		const { page = 1, pagesize = 30 } = params;
		const { userId } = payload;
		return await this.CollectModel.find({
			where: { userId, typeId: 1 },
			order: { id: 'DESC' },
			skip: (page - 1) * pagesize,
			take: pagesize,
			cache: true,
		});
	}

	async remove(payload, params) {
		const { mid } = params;
		if (!payload) {
			throw new HttpException('请先登录', HttpStatus.UNAUTHORIZED);
		}
		const { userId } = payload;
		const u = await this.CollectModel.findOne({ where: { userId, mid } });
		if (u) {
			await this.CollectModel.remove(u);
			return '移除完成';
		} else {
			throw new HttpException('无权移除此歌曲！', HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * @desc 每天十二点更新歌单，从这些分类随机选择一个分类拿到一个分类  然后获取前30首音乐，作为每天的歌单
	 *       1.固定获取一个分类，拿到歌曲基本信息，通过mid可以拿到歌曲具体地址
	 */
	async musicHotList(params) {
		const { mid } = params;
		const res = await this.MusicModel.query(`select max(customId) as max from tb_music`);
		const lastMaxCustomId = res[0].max;
		const url = `https://www.kuwo.cn/playlist_detail/${mid}`;
		const musicList = await spiderKuWoHotMusic(url, lastMaxCustomId);
		return await this.MusicModel.save(musicList);
	}
}
