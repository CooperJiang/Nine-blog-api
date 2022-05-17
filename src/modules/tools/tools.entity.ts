import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/baseEntity';

@Entity({ name: 'tb_tools' })
export class ToolsEntity extends BaseEntity {
	@Column({ unique: true })
	orderId: number;

	@Column({ length: 32 })
	name: string;

	@Column()
	typeId: number;

	@Column({ length: 500 })
	logo: string;

	@Column({ length: 255, nullable: true })
	desc: string;

	@Column({ length: 255, nullable: true })
	path: string;

	@Column({ length: 255, nullable: true })
	url: string;

	@Column({ default: 1 })
	status: number;
}
