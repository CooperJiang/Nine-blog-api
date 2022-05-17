import { CollectEntity } from './../collect/collect.entity';
import { UserEntity } from './../user/user.entity';
import { CommonService } from './../common/common.service';
import { Repository, LessThan } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Like, In } from 'typeorm';
@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity)
		private readonly ArticleModel: Repository<ArticleEntity>,
		@InjectRepository(UserEntity)
		private readonly UserModel: Repository<UserEntity>,
		@InjectRepository(CollectEntity)
		private readonly CollectModel: Repository<CollectEntity>,
		private readonly CommonService: CommonService,
	) {}

	/**
	 * @desc 设置新增的时候需要如果没有orderId 需要自己追加 追加规则是
	 *       1： 大于 5000 的id视为置顶文章
	 * 			 2： 每次新增拿到 5000 以下的最大 orderId 为其加上10代表新的一条的id
	 */
	async set(params) {
		const { id, title } = params;
		if (id) return this.ArticleModel.update({ id }, params);
		const article = await this.ArticleModel.findOne({ title });
		if (article && !id) throw new HttpException('此文章已经上传过了！', HttpStatus.BAD_REQUEST);
		/* 添加新文章前查询最大orderId */
		const { orderId = 99 } = await this.ArticleModel.findOne({
			where: { orderId: LessThan(5000) },
			order: { orderId: 'DESC' },
			select: ['id', 'orderId'],
		});
		!params.orderId && (params.orderId = orderId + 10);
		return this.ArticleModel.save(params);
	}

	/**
	 * @desc 文章查询接口
	 * 	1：tag没有关联表，存的是[].join(',')格式，所以后端查询typeorm没有api支持，所以这里改为sql查询
	 *  2：查询多标题的时候是or关系需要()，需要注意
	 *  3：子查询或者left join查询的性能实际很低，自己用代码查询组装数据性能会高很多，只需要查询两次
	 * @param params
	 * @returns
	 */
	async query(params) {
		const { page = 1, pageSize = 10, typeId, keyword, status } = params;
		let { tagId } = params;
		tagId && (tagId = Array.isArray(tagId) ? tagId : [tagId]); // get方法如果只有图个长度就变成字符串了都统一转为数组
		/* 子查询只可以查询一个字段 */
		// let sql = 'select *,(select nickname from tb_user where tb_user.id = userId) as nickname,(select name from tb_type where tb_type.id = typeId) as typename from tb_article where id > 0'
		/* left join可以查询整表,可以指定字段 */
		// let sql = 'select A.*,B.nickname,B.username from tb_article as A LEFT JOIN  tb_user as B on A.userId = B.id where A.id > 0'
		/* 基础查询即可，扩展数据自己组装 */
		let sql = 'select * from tb_article as A  where A.id > 0';
		if (tagId) {
			let tagSql = '';
			tagId.forEach(
				(t, i) => (tagSql += i == tagId.length - 1 ? `find_in_set(${t}, A.tagId)` : `find_in_set(${t}, A.tagId) or `),
			);
			sql += ` and (${tagSql})`;
		}
		typeId && (sql += ` and A.typeId = ${typeId}`);
		status && (sql += ` and A.status = ${status}`);
		keyword && (sql += ` and A.title like '%${keyword}%'`);
		sql += ` ORDER BY orderId DESC`;
		/* 查询count总数要在分页前查询完 */
		const countSql = ` select count(*) as total from (${sql}) as a`;
		const count: any = await this.ArticleModel.query(countSql);
		/* 添加分页 */
		sql += ' limit ' + (page - 1) * pageSize + ',' + pageSize;
		const rows: any = await this.ArticleModel.query(sql);
		const userIds = rows.map((t) => t.userId);
		const typeIds = rows.map((t) => t.typeId);
		const tagIds = [];
		rows.map((t) => t.tagId.split(',')).forEach((k) => k.forEach((j) => tagIds.push(j)));
		const [users, types, tags]: any = await Promise.all([
			this.CommonService.findUserMap(userIds),
			this.CommonService.findTypeMap(typeIds),
			this.CommonService.findTagMap([...new Set(tagIds)]),
		]);
		await this.CommonService.mergeArticleInfo({ data: rows, users, types, tags });
		return { rows, count: Number(count[0].total) };
	}

	/**
	 * @desc 删除文章
	 * @param params
	 * @returns
	 */
	async del(params) {
		const { id } = params;
		return await this.ArticleModel.delete({ id });
	}

	/**
	 * @desc 文章详情
	 */
	async detail(params, req) {
		const { id } = params;
		const res: any = await this.ArticleModel.findOne({ id });
		const { tagId, userId } = res;
		const user: any = await this.UserModel.findOne({ where: { id: userId }, select: ['avatar'] });
		res.avatar = user.avatar;
		res.tagArray = await this.CommonService.findTagMap(tagId.split(','));
		if (req?.payload?.userId) {
			const isLiked = await this.CollectModel.count({ userId, articleId: id, delete: 0 });
			isLiked && (res.isLiked = true);
		}
		return res;
	}

	/**
	 * @desc 热门文章 待接入访问量之后使用
	 * @returns
	 */
	async hot() {
		return await this.ArticleModel.find({
			order: { readVolume: 'DESC' },
			select: ['id', 'title', 'readVolume'],
			take: 10,
		});
	}

	/**
	 * @desc 统计文章访问量
	 * @param param 文章id
	 */
	async read({ id }) {
		const article = await this.ArticleModel.findOne({ where: { id }, select: ['readVolume'] });
		const readVolume = article ? article.readVolume + 1 : 1;
		return await this.ArticleModel.update({ id }, { readVolume });
	}
}
