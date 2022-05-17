import { Repository } from 'typeorm';
import { ProjectEntity } from './projtct.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectService {
	constructor(
		@InjectRepository(ProjectEntity)
		private readonly ProjectModel: Repository<ProjectEntity>,
	) {}

	/* 添加编辑项目 */
	async set(params) {
		const { data, id } = params;
		if (id) {
			return await this.ProjectModel.update({ id }, data);
		}
		const res = await this.ProjectModel.query(`select max(orderId) as max_order from tb_project`);
		let { max_order } = res[0];
		max_order = max_order > 0 ? max_order : 1;
		data.orderId = data.orderId ? data.orderId : max_order + 10;
		return await this.ProjectModel.save(data);
	}

	async query(params) {
		const { page = 1, pageSize = 10, status } = params;
		const where: any = {};
		status && (where.status = status);
		const rows = await this.ProjectModel.find({
			order: { orderId: 'DESC' },
			where,
			skip: (page - 1) * pageSize,
			take: pageSize,
			cache: true,
		});
		const count = await this.ProjectModel.count({ where });
		return { rows, count };
	}

	async del(params) {
		const { id } = params;
		return await this.ProjectModel.delete({ id });
	}
}
