import { ArticleEntity } from './../article/article.entity';
import { getNotEmptyKey } from './../../utils/tools';
import { InjectRepository } from '@nestjs/typeorm';
import { collectTypeMap, collectModuleMap } from './../../constant/collec';
import { Injectable, Module, HttpException, HttpStatus } from '@nestjs/common';
import { delEmptyCondition } from 'src/utils/tools';
import { CollectEntity } from './collect.entity';
import { Repository, LessThan } from 'typeorm';

@Injectable()
export class CollectService {
	constructor(
		@InjectRepository(CollectEntity)
		private readonly CollectModule: Repository<CollectEntity>,
		@InjectRepository(ArticleEntity)
		private readonly ArticleModule: Repository<ArticleEntity>,
	) {}

	/**
	 * @desc 收藏与取消收藏点赞
	 * @param params
	 * @returns
	 */
	async set(params, req) {
		const { articleId, toolId, mid, resourceId, typeId, projectId, isLike } = params;
		const { userId } = req.payload;
		const key = getNotEmptyKey({ articleId, toolId, mid, resourceId, projectId });
		const data: any = {};
		data.typeId = typeId;
		data.userId = userId;
		data[key] = params[key];
		/* 点赞则添加新记录、取消点赞则伪删除保留记录 */
		if (isLike === 1) {
			const isHasown = await this.CollectModule.findOne({ userId, [key]: params[key], delete: 0 });
			if (isHasown) {
				throw new HttpException('已收藏过此项目！', HttpStatus.BAD_REQUEST);
			}
			await this.CollectModule.save(data);
			const module = collectModuleMap[key];
			// TODO 查询的值和设置的值也需要根据typeId不同分类区分  暂时只做文章先不考虑 取消同理 或者其他表的收藏数字段设置为同名即可
			const result = await this[module].findOne({ where: { id: params[key] }, select: ['collectionVolume'] });
			const collectionVolume = result ? result.collectionVolume + 1 : 1;
			await this[module].update({ id: params[key] }, { collectionVolume });
			return true;
		} else {
			const module = collectModuleMap[key];
			const result = await this[module].findOne({ where: { id: params[key] }, select: ['collectionVolume'] });
			const collectionVolume = result ? result.collectionVolume - 1 : 0;
			await this[module].update({ id: params[key] }, { collectionVolume });
			return await this.CollectModule.update({ [key]: params[key], userId }, { delete: 1 });
		}
	}
}
