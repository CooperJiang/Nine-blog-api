import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity({ name: 'tb_message' })
export class MessageEntity extends BaseEntity {
	@Column()
	userId: number;

	@Column('text')
	content: string;

	@Column({ length: 64 })
	type: string;

	@Column()
	roomId: number;

	@Column({ default: 1 })
	status: number;
}
