import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/baseEntity';

@Entity({ name: 'tb_resource' })
export class ResourceEntity extends BaseEntity {
	@Column({ nullable: true, comment: '排序id' })
	orderId: number;

	@Column({ length: 32, comment: '资源名称' })
	name: string;

	@Column({ comment: '资源描述' })
	desc: string;

	@Column({ nullable: true, comment: '资源logo' })
	logo: string;

	@Column({ comment: '资源地址' })
	url: string;

	@Column({ comment: '资源分类ID' })
	resourceId: number;
}
