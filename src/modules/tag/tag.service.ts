import { ArticleEntity } from './../article/article.entity';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TagService {
	constructor(
		@InjectRepository(TagEntity)
		private readonly TagModel: Repository<TagEntity>,
		@InjectRepository(ArticleEntity)
		private readonly ArticleModel: Repository<ArticleEntity>,
	) {}

	async set(params) {
		const { name, id } = params;
		const tag = await this.TagModel.findOne({ name });
		if (tag) {
			return await this.TagModel.update({ id: tag.id }, { name });
		}
		if (id) {
			return await this.TagModel.update({ id }, { name });
		}
		return await this.TagModel.save({ name });
	}

	async query(params) {
		const { page = 1, pageSize = 10 } = params;
		const rows = await this.TagModel.find({
			order: { id: 'DESC' },
			skip: (page - 1) * pageSize,
			take: pageSize,
			cache: false,
		});
		const count = await this.TagModel.count();
		return { rows, count };
	}

	async del(params) {
		const { id } = params;
		const count = await this.ArticleModel.count({ tagId: id });
		if (count > 0) {
			throw new HttpException('该标签有文章正在使用中！', HttpStatus.BAD_REQUEST);
		}
		return await this.TagModel.delete({ id });
	}
}
