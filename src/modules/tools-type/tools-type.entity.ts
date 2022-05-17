import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/baseEntity';

@Entity({ name: 'tb_tools_type' })
export class ToolsTypeEntity extends BaseEntity {
	@Column({ unique: true })
	orderId: number;

	@Column({ length: 32 })
	name: string;

	@Column({ length: 255, default: '分类描述' })
	desc: string;

	@Column({ default: 1 })
	status: number;
}
