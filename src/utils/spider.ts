import * as cheerio from 'cheerio';
import axios from 'axios';
import * as Qs from 'qs';

import html2md from 'html-to-md';

/**
 * @desc 请求页面通过cherrion格式化文档返回给业务处理
 * @param url 请求地址
 * @returns
 */
export const requestHtml = async (url) => {
	const body: any = await requestInterface(url);
	return cheerio.load(body, { decodeEntities: false });
};

/**
 * @desc 提取出博客的正文html部分转为md格式
 * @param html 解析的网页
 * @param dom 需要分析的dom节点
 * @returns
 */
export const formatHtml = (html, dom = '.markdown-body') => {
	const $ = cheerio.load(html, { decodeEntities: false });
	const data = $(dom).html();
	return html2md(data);
};

/**
 * @desc axios调用三方接口使用
 */
export const requestInterface = async (url, param = {}, method: any = 'GET') => {
	return new Promise((resolve, reject) => {
		axios({
			method,
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'zh-CN,zh;q=0.9',
				'cache-control': 'no-cache',
				csrf: 'MEWX5B55MBB',
				pragma: 'no-cache',
				'sec-ch-ua': '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				cookie:
					'_ga=GA1.2.1049405325.1635954830; _gid=GA1.2.2140587553.1635954830; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1635954830,1636115008; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1636170510; _gat=1; kw_token=MEWX5B55MBB',
			},
			url,
			data: Qs.stringify(param),
		})
			.then((res) => {
				resolve(res.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

/**
 * @desc 搜索音乐
 * @param url
 * @returns
 */
export const searchMusic = async (url) => {
	return new Promise((resolve, reject) => {
		axios({
			url,
			method: 'GET',
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'zh-CN,zh;q=0.9',
				'sec-ch-ua': '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				Referer: 'https://www.kuwo.cn/search/list?key=%E5%AD%A4%E5%9F%8E',
				Cookie:
					'_ga=GA1.2.1049405325.1635954830; _gid=GA1.2.2140587553.1635954830; gid=bc653d0b-61c5-4d69-ac7f-2ee3e87dd0ce; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1635954830,1636115008,1636207872; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1636211110; kw_token=H77LBB1XLI; _gat=1',
				csrf: 'H77LBB1XLI',
			},
		})
			.then((res) => {
				resolve(res.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

/**
 * @desc 获取酷我音乐单个分类下的音乐的30首列表并写入数据库
 *       每次拿到目前数据库最大的customId往上加
 * @returns [] 歌曲列表
 */
export const spiderKuWoHotMusic = async (url, lastMaxCustomId = 0) => {
	const body: any = await requestInterface(url);
	const $ = cheerio.load(body, { decodeEntities: false });
	const musicListNodes = $('.album_list:first').children();
	const musicList = [];
	musicListNodes.each((index, node) => {
		const customId = index + 1 + lastMaxCustomId;
		const href = $(node).find('a').attr('href');
		const mid = href.split('/')[2];
		const album = $(node).find('a').attr('title');
		const time = $(node).find('.song_time span').text();
		const duration = Number(time.split(':')[0]) * 60 + Number(time.split(':')[1]);
		const singer = $(node).find('.song_artist span').text();
		musicList.push({ customId, album, duration, singer, mid });
	});
	return musicList;
};

/* mp4获取地址 */
// https://www.kuwo.cn/api/v1/www/music/playUrl?mid=187717013&type=mv&httpsStatus=1&reqId=958f2950-3f25-11ec-a345-4125bd2a21d6

/**
 * @desc 获取百度统计的数据
 * @param url
 * @returns
 */
export const searchBaiduData = async (url = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData') => {
	return new Promise((resolve, reject) => {
		axios
			.get(
				'https://openapi.baidu.com/rest/2.0/tongji/report/getData?access_token=121.141b90164ddd132df0ebb1ce4c60eb07.Y3dQBY0NoH2Llf7M_1Zub-guF8V5AeWpwIDpFMp.48jxLQ&site_id=17558179&method=overview/getTimeTrendRpt&start_date=20220111&end_date=20220122&metrics=pv_count,visitor_count,ip_count',
			)
			.then((res) => {
				resolve(res.data);
			});
	});
};
