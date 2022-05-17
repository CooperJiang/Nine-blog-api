import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/baseEntity';

@Entity({ name: 'tb_comment' })
export class CommentEntity extends BaseEntity {
	@Column()
	userId: number;

	@Column()
	comment: string;

	@Column({ nullable: true })
	articleId: number;

	@Column({ nullable: true })
	upId: number;

	@Column({ nullable: true })
	ip: string;

	@Column({ nullable: true })
	address: string;
}
