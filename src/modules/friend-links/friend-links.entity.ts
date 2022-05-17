import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/baseEntity';

@Entity({ name: 'tb_friend_links' })
export class FriendLinksEntity extends BaseEntity {
	@Column()
	orderId: number;

	@Column({ length: 64 })
	name: string;

	@Column()
	desc: string;

	@Column()
	avatar: string;

	@Column()
	url: string;

	@Column()
	status: number;
}
