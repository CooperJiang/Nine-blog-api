import {
	Column,
	Entity,
	// OneToMany,
	// OneToOne,
	// JoinColumn,
} from 'typeorm';
// import { PhotoEntity } from '../photo/photo.entity';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity({ name: 'tb_type' })
export class TypeEntity extends BaseEntity {
	@Column({ length: 16, unique: true })
	name: string;

	@Column({ length: 16 })
	value: string;

	@Column({ length: 30 })
	desc: string;
	//一对多关系
	// @OneToMany(() => PhotoEntity, (photo) => photo.user)
	// photos: [];
}
