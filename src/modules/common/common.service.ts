import { TagEntity } from './../tag/tag.entity';
import { TypeEntity } from './../type/type.entity';
import { In, Repository } from 'typeorm';
import { UserEntity } from './../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import MergeArticleInfo from './type';
@Injectable()
export class CommonService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly UserModel: Repository<UserEntity>,
		@InjectRepository(TypeEntity)
		private readonly TypeModel: Repository<TypeEntity>,
		@InjectRepository(TagEntity)
		private readonly TagModel: Repository<TagEntity>,
	) {}

	/* 拿到所有用户名称映射回去 */
	async findUserMap(ids) {
		return await this.UserModel.find({ where: { id: In(ids) }, select: ['id', 'username', 'nickname'] }).then((res) => {
			return res;
		});
	}

	/* 拿到所有分类名称映射回去 */
	async findTypeMap(ids) {
		return await this.TypeModel.find({ where: { id: In(ids) }, select: ['id', 'name'] }).then((res) => {
			return res;
		});
	}

	/* 拿到所有标签映射回去 */
	async findTagMap(ids) {
		return await this.TagModel.find({ where: { id: In(ids) }, select: ['id', 'name'] }).then((res) => {
			return res;
		});
	}

	/* 合并数据映射回去，组装名称，标签，分类名 */
	async mergeArticleInfo(mergeArticleInfo: MergeArticleInfo) {
		const { data, users, types, tags } = mergeArticleInfo;
		if (!data.length) return;
		data.forEach((item: any) => {
			users && (item.nickname = users.find((t: any) => t.id == item.userId)['nickname']);
			types && (item.typeName = types.find((t: any) => t.id == item.typeId)['name']);
			const tagIdArr = item.tagId.split(',');
			item.tagArr = [];
			tagIdArr.forEach((k) => item.tagArr.push(tags.find((t: any) => t.id == k)));
			delete item.content;
		});
	}
}
