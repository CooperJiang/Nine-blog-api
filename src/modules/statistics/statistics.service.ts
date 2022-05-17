import { FriendLinksEntity } from './../friend-links/friend-links.entity';
import { CommentEntity } from './../comment/comment.entity';
import { formatBaiduReq } from './../../utils/date';
import { ArticleEntity } from './../article/article.entity';
import { Injectable } from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { TypeEntity } from '../type/type.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class StatisticsService {
	constructor(
		@InjectRepository(ArticleEntity)
		private readonly ArticleModel: Repository<ArticleEntity>,
		@InjectRepository(TypeEntity)
		private readonly TypeModel: Repository<TypeEntity>,
		@InjectRepository(CommentEntity)
		private readonly CommentModel: Repository<CommentEntity>,
		@InjectRepository(FriendLinksEntity)
		private readonly FriendLinksModel: Repository<FriendLinksEntity>,
		@InjectRepository(UserEntity)
		private readonly UserModel: Repository<UserEntity>,
	) {}

	/**
	 * @desc 查询网站访问量 pv uv ip
	 * 			token刷新一个月有效期	https://tongji.baidu.com/api/manual/Chapter2/openapi.html
	 * 			TODO 待添加自动更新token
	 * @param params
	 * @returns
	 */
	async visit(params) {
		const { date } = params;
		const start_date = formatBaiduReq(new Date().getTime());
		const end_date = formatBaiduReq(new Date().getTime() - Number(date - 1) * 24 * 60 * 60 * 1000);
		const url = `https://openapi.baidu.com/rest/2.0/tongji/report/getData?access_token=121.f313de9dd8b1ed7bc4bfc248a3055052.YlwA80yYxHjxMa31pBtfmwJh5kDgfsk7sTKBGzw.EASTlg&site_id=17558179&method=overview/getTimeTrendRpt&start_date=${end_date}&end_date=${start_date}&metrics=pv_count,visitor_count,ip_count`;
		const res = await axios.get(url);
		return res.data;
	}

	/**
	 * @desc 获取各个分类的文章数量
	 * @returns
	 */
	async typeInfo() {
		const type = await this.TypeModel.find({ select: ['id', 'name'] });
		const typeIds = type.map((t: any) => t.id);
		const task = [];
		typeIds.forEach((id) => task.push(this.ArticleModel.count({ where: { typeId: id } })));
		const articleNumsMap = await Promise.all(task);
		type.forEach((t: any, i) => (t.nums = articleNumsMap[i]));
		return type;
	}

	/**
	 * @desc 获取汇总信息
	 */
	async summary() {
		const articleNum = await this.ArticleModel.count();
		const draftNum = await this.ArticleModel.count({ where: { status: -1 } });
		const leaveMsgNum = await this.CommentModel.count({ where: { articleId: IsNull() } });
		const friendLinkNum = await this.FriendLinksModel.count({ where: { status: 1 } });
		const userNum = await this.UserModel.count();
		return { articleNum, draftNum, leaveMsgNum, friendLinkNum, userNum };
	}
}
