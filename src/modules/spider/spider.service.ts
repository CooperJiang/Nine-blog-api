import { requestInterface, searchMusic, requestHtml } from './../../utils/spider';
import { Injectable } from '@nestjs/common';
import * as https from 'https';
import * as cheerio from 'cheerio';
// import * as html2md from 'html-to-md'
const html2md = require('html-to-md');

@Injectable()
export class SpiderService {
	constructor() {}

	async test(params) {
		const { mid } = params;
		const url = `https://www.kuwo.cn/api/www/music/musicInfo?mid=${mid}&httpsStatus=1&reqId=0b8cd740-409f-11ec-af85-c164fd2658ed`;
		const res = await requestInterface(url);

		return res;
	}

	async searchMusic({ keyword, page = 1, pagesize = 30 }) {
		keyword = encodeURIComponent(keyword);
		const url = `https://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=${keyword}&pn=${page}&rn=${pagesize}&httpsStatus=1&reqId=443229f0-3f29-11ec-a345-4125bd2a21d6`;
		return await searchMusic(url);
	}

	async searchMv(mid) {
		const url = `https://www.kuwo.cn/api/v1/www/music/playUrl?mid=${mid}&type=mv&httpsStatus=1&reqId=f8064a10-3f2e-11ec-8157-6fda69b0bb2a`;
		return await requestInterface(url);
	}
}
