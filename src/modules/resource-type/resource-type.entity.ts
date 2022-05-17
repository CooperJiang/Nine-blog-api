import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/baseEntity';

@Entity({ name: 'tb_resource_type' })
export class ResourceTypeEntity extends BaseEntity {
	@Column({ unique: true })
	orderId: number;

	@Column({ length: 16 })
	name: string;

	@Column({ default: 1 })
	status: number;
}
