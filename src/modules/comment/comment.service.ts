import { UserEntity } from './../user/user.entity';
import { Injectable } from '@nestjs/common';
import { CommentEntity } from './comment.entity';
import { Repository, In, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(CommentEntity)
		private readonly CommentModel: Repository<CommentEntity>,
		@InjectRepository(UserEntity)
		private readonly UserModel: Repository<UserEntity>,
	) {}
	async set(params, req) {
		const { userId } = req.payload;
		const data = { ...params, userId };
		return await this.CommentModel.save(data);
	}

	async query(params) {
		const { page = 1, pageSize = 10, status, articleId } = params;
		const where: any = { upId: null };
		status && (where.status = status);
		articleId && (where.articleId = articleId);
		!articleId && (where.articleId = IsNull());
		const rows = await this.CommentModel.find({
			order: { id: 'DESC' },
			where,
			skip: (page - 1) * pageSize,
			take: pageSize,
			cache: true,
		});
		/* 查出当前评论及其所有的子评论 */
		const commentIds = rows.map((t) => t.id);
		const childComment = await this.CommentModel.find({ upId: In([...new Set(commentIds)]) });

		/* 拿到所有评论人的userId */
		const upperIds = [...new Set(rows.map((t) => t.userId))];
		const lowerIds = [...new Set(childComment.map((t) => t.userId))];
		const userIds = [...new Set([...upperIds, ...lowerIds])];
		const userInfo = await this.UserModel.find({ id: In(userIds) });
		childComment.forEach((t: any) => {
			t.nickname = userInfo.find((k) => k.id === t.userId)['nickname'];
			t.avatar = userInfo.find((k) => k.id === t.userId)['avatar'];
			t.role = userInfo.find((k) => k.id === t.userId)['role'];
		});
		rows.forEach((t: any) => {
			t.nickname = userInfo.find((k) => k.id === t.userId)['nickname'];
			t.avatar = userInfo.find((k) => k.id === t.userId)['avatar'];
			t.role = userInfo.find((k) => k.id === t.userId)['role'];
			t.chlidComment = childComment.filter((k) => t.id === k.upId);
		});
		const count = await this.CommentModel.count(where);
		return { rows, count };
	}
}
