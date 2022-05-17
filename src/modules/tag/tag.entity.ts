import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/baseEntity';

@Entity({ name: 'tb_tag' })
export class TagEntity extends BaseEntity {
	@Column({ length: 16, unique: true })
	name: string;
}
