import { ResourceEntity } from '../resource/resource.entity';
import { Repository, In } from 'typeorm';
import { ResourceTypeEntity } from './resource-type.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResourceTypeService {
	constructor(
		@InjectRepository(ResourceTypeEntity)
		private readonly ResourceTypeModel: Repository<ResourceTypeEntity>,
		@InjectRepository(ResourceEntity)
		private readonly ResourceModel: Repository<ResourceEntity>,
	) {}

	async set(params) {
		const { name, status, orderId, id } = params;
		const data: any = { name, orderId, status };
		const r = await this.ResourceTypeModel.findOne({ name });
		if (r) {
			return await this.ResourceTypeModel.update({ id: r.id }, data);
		}
		if (id) {
			return await this.ResourceTypeModel.update({ id }, data);
		}
		const res = await this.ResourceTypeModel.query(`select max(orderId) as max_order from tb_resource_type`);
		let { max_order } = res[0];
		max_order = max_order > 0 ? max_order : 1;
		data.orderId = orderId ? orderId : max_order + 10;
		return await this.ResourceTypeModel.save(data);
	}

	async query(params) {
		const { page = 1, pageSize = 10 } = params;
		const rows = await this.ResourceTypeModel.find({
			order: { id: 'ASC' },
			skip: (page - 1) * pageSize,
			take: pageSize,
			cache: true,
		});
		const ids = rows.map((t) => t.id);
		const res: any = await this.ResourceModel.find({ resourceId: In(ids) });
		rows.forEach((t: any) => (t.resource_num = res.filter((k) => k.resourceId === t.id).length));
		const count = await this.ResourceTypeModel.count();
		return { rows, count };
	}

	async queryAll(params) {
		// const {page = 1,pageSize = 10} = params
		const rows = await this.ResourceTypeModel.find({
			order: { orderId: 'ASC' },
			where: { status: 1 },
			// skip: (page - 1) * pageSize,
			// take: pageSize,
			cache: true,
		});
		const resourceIds = rows.map((t) => t.id);
		const res: any = await this.ResourceModel.find({ resourceId: In(resourceIds) });
		rows.forEach((t: any) => (t.resource = res.filter((k) => k.resourceId == t.id)));
		const count = await this.ResourceTypeModel.count();
		return { rows, count };
	}

	async del(params) {
		const { id } = params;
		const count = await this.ResourceModel.count({ resourceId: id });
		if (count > 0) {
			throw new HttpException('当前分类正在使用中！', HttpStatus.BAD_REQUEST);
		}
		const r = await this.ResourceTypeModel.findOne({ id });
		if (!r) {
			throw new HttpException('非法操作,无此分类！', HttpStatus.BAD_REQUEST);
		}
		return await this.ResourceTypeModel.delete({ id });
	}
}
