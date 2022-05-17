import { UserEntity } from './../user/user.entity';
import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity({ name: 'tb_music' })
export class MusicEntity extends BaseEntity {
	@Column({ nullable: true })
	customId: number;

	@Column({ length: 300 })
	album: string;

	@Column()
	mid: number;

	@Column()
	duration: number;

	@Column({ length: 300 })
	singer: string;

	@Column({ default: 0 })
	hot: number;
}
