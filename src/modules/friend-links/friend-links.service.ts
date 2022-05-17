import { Repository } from 'typeorm';
import { FriendLinksEntity } from './friend-links.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendLinksService {
	constructor(
		@InjectRepository(FriendLinksEntity)
		private readonly FriendLinksModel: Repository<FriendLinksEntity>,
	) {}

	async set(params) {
		const { name, status, orderId, desc, url, avatar, id } = params;
		const data = { name, status, orderId, desc, url, avatar };
		const f = await this.FriendLinksModel.findOne({ name });
		if (f) {
			return await this.FriendLinksModel.update({ id: f.id }, data);
		}
		if (id) {
			return await this.FriendLinksModel.update({ id }, data);
		}
		const res = await this.FriendLinksModel.query(`select max(orderId) as max_order from tb_friend_links`);
		let { max_order } = res[0];
		max_order = max_order > 0 ? max_order : 1;
		data.orderId = orderId ? orderId : max_order + 10;
		return await this.FriendLinksModel.save(data);
	}

	async query(params) {
		const { page = 1, pageSize = 10, status } = params;
		const where: any = {};
		status && (where.status = status);
		const rows = await this.FriendLinksModel.find({
			order: { orderId: 'DESC' },
			where,
			skip: (page - 1) * pageSize,
			take: pageSize,
			cache: true,
		});
		const count = await this.FriendLinksModel.count({ where });
		return { rows, count };
	}

	async del(params) {
		const { id } = params;
		return await this.FriendLinksModel.delete({ id });
	}
}
