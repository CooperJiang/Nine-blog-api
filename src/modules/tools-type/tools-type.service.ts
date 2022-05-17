import { ToolsEntity } from './../tools/tools.entity';
import { Repository, In } from 'typeorm';
import { ToolsTypeEntity } from './tools-type.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ToolsTypeService {
	constructor(
		@InjectRepository(ToolsTypeEntity)
		private readonly toolsTypeModel: Repository<ToolsTypeEntity>,
		@InjectRepository(ToolsEntity)
		private readonly toolsModel: Repository<ToolsEntity>,
	) {}

	/**
	 * @desc 工具分类新增编辑
	 * @param params
	 * @returns
	 */
	async set(params) {
		const { name, status, orderId, id } = params;
		const data: any = { name, orderId, status };
		const r = await this.toolsTypeModel.findOne({ name });
		if (r) {
			return await this.toolsTypeModel.update({ id: r.id }, data);
		}
		if (id) {
			return await this.toolsTypeModel.update({ id }, data);
		}
		const res = await this.toolsTypeModel.query(`select max(orderId) as max_order from tb_tools_type`);
		let { max_order } = res[0];
		max_order = max_order > 0 ? max_order : 1;
		data.orderId = orderId ? orderId : max_order + 10;
		return await this.toolsTypeModel.save(data);
	}

	/**
	 * @desc 工具分类查询
	 * @param params
	 * @returns
	 */
	async query(params) {
		const { page = 1, pageSize = 10 } = params;
		const rows = await this.toolsTypeModel.find({
			order: { orderId: 'DESC' },
			skip: (page - 1) * pageSize,
			take: pageSize,
			cache: true,
		});
		const ids = rows.map((t) => t.id);
		const res: any = await this.toolsModel.find({ typeId: In(ids) });
		rows.forEach((t: any) => (t.tools_num = res.filter((k) => k.typeId === t.id).length));
		const count = await this.toolsTypeModel.count();
		return { rows, count };
	}

	async del(params) {
		const { id } = params;
		const count = await this.toolsModel.count({ typeId: id });
		if (count > 0) {
			throw new HttpException('当前分类正在使用中！', HttpStatus.BAD_REQUEST);
		}
		const r = await this.toolsTypeModel.findOne({ id });
		if (!r) {
			throw new HttpException('非法操作,无此分类！', HttpStatus.BAD_REQUEST);
		}
		return await this.toolsTypeModel.delete({ id });
	}
}
