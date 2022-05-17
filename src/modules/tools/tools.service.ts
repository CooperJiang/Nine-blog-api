import { ToolsTypeEntity } from './../tools-type/tools-type.entity';
import { ToolsEntity } from './tools.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository, In, Like } from 'typeorm';

@Injectable()
export class ToolsService {
	constructor(
		@InjectRepository(ToolsEntity)
		private readonly toolsModel: Repository<ToolsEntity>,
		@InjectRepository(ToolsTypeEntity)
		private readonly toolsTypeModel: Repository<ToolsTypeEntity>,
	) {}

	async set(params) {
		const { typeId, logo, name, desc, url, orderId, id, path } = params;
		const data = { typeId, logo, name, desc, url, orderId, path };
		const r = await this.toolsModel.findOne({ name });
		if (r) {
			return await this.toolsModel.update({ id: r.id }, data);
		}
		if (id) {
			return await this.toolsModel.update({ id }, data);
		}
		const res = await this.toolsModel.query(`select max(orderId) as max_order from tb_tools`);
		let { max_order } = res[0];
		max_order = max_order > 0 ? max_order : 1;
		data.orderId = orderId ? orderId : max_order + 10;
		return await this.toolsModel.save(data);
	}

	async query(params) {
		const { page = 1, pageSize = 10, typeId, name } = params;
		const where: any = {};
		typeId && (where.typeId = typeId);
		name && (where.name = Like(`%${name}%`));
		const rows = await this.toolsModel.find({
			order: { orderId: 'DESC' },
			where,
			skip: (page - 1) * pageSize,
			take: pageSize,
			cache: true,
		});
		const typeIds = rows.map((t) => t.typeId);
		const ToolsType = await this.toolsTypeModel.find({ id: In(typeIds) });
		rows.forEach((t: any) => (t.toolName = ToolsType.find((k) => k.id == t.typeId)['name']));
		const count = await this.toolsModel.count({ where });
		return { rows, count };
	}

	async del(params) {
		const { id } = params;
		return await this.toolsModel.delete({ id });
	}

	/**
	 * @desc 抖音视频去水印 拿无水印视频 音频
	 * @param params {url: 视频地址}
	 * @returns
	 */
	async douyin(params) {
		const { url } = params;
		const longUrl: any = await axios.get(url);
		const videoId = longUrl.request.path.substr(13, 19);
		const api = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${videoId}`;
		const res = await axios.get(api);
		const { music, video, share_info } = res.data.item_list[0];
		const mp3 = music?.play_url?.uri;
		const mp4 = video.play_addr.url_list[0].replace('playwm', 'play');
		const title = share_info.share_title;
		return { mp3, mp4, title };
	}

	/**
	 * @desc 抖音视频地址中转流文件进行下载
	 * @param params {url: 视频地址}
	 * @returns
	 */
	async douyinload(params, res) {
		const { url } = params;
		return axios({
			url,
			headers: {
				accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'accept-language': 'en-US,en;q=0.9',
				'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'document',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-site': 'none',
				'sec-fetch-user': '?1',
				'upgrade-insecure-requests': '1',
				cookie:
					'msToken=xJsbor9nbwecJE3YIubD8KWOeRQl4k3LsBAQEcTNHfDNLo8Vtu1-93ZraUFaRoqOW6Dgo2r_KNh9gJKaEFtbn7-Z5q8HGe0PZO8ZQo54RZBZ',
				'user-agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
			},
			responseType: 'stream',
		}).then((ret) => {
			const timespace = new Date().getTime();
			res.header('Content-Disposition', `attachment; filename="snine-${timespace}.mp4"`);
			res.header('Content-type', `video/mp4`);
			ret.data.pipe(res);
		});
	}
}
