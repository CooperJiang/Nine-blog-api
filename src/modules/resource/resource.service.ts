import { Like } from 'typeorm';
import { ResourceTypeEntity } from '../resource-type/resource-type.entity';
import { ResourceEntity } from './resource.entity';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResourceService {
	constructor(
		@InjectRepository(ResourceEntity)
		private readonly ResourceModel: Repository<ResourceEntity>,
		@InjectRepository(ResourceTypeEntity)
		private readonly ResourceTypeModel: Repository<ResourceTypeEntity>,
	) {}

	async set(params) {
		const { resourceId, logo, name, desc, url, orderId, id } = params;
		const data = { resourceId, logo, name, desc, url, orderId };
		const r = await this.ResourceModel.findOne({ name });
		if (r) {
			return await this.ResourceModel.update({ id: r.id }, data);
		}
		if (id) {
			return await this.ResourceModel.update({ id }, data);
		}
		const res = await this.ResourceModel.query(`select max(orderId) as max_order from tb_resource`);
		let { max_order } = res[0];
		max_order = max_order > 0 ? max_order : 1;
		data.orderId = orderId ? orderId : max_order + 10;
		return await this.ResourceModel.save(data);
	}

	async query(params) {
		const { page = 1, pageSize = 10, resourceId, name } = params;
		const where: any = {};
		resourceId && (where.resourceId = resourceId);
		name && (where.name = Like(`%${name}%`));
		const rows = await this.ResourceModel.find({
			order: { id: 'DESC' },
			where,
			skip: (page - 1) * pageSize,
			take: pageSize,
			cache: true,
		});
		const resourceIds = rows.map((t) => t.resourceId);
		const recourceType = await this.ResourceTypeModel.find({ id: In(resourceIds) });
		rows.forEach((t: any) => (t.resourceName = recourceType.find((k) => k.id == t.resourceId)['name']));
		const count = await this.ResourceModel.count({ where });
		return { rows, count };
	}

	async del(params) {
		const { id } = params;
		return await this.ResourceModel.delete({ id });
	}
}
