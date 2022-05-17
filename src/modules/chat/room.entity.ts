import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity({ name: 'tb_room' })
export class RoomEntity extends BaseEntity {
	@Column({ unique: true })
	roomUserId: number;

	@Column({ unique: true })
	roomId: number;

	@Column({ length: 255, nullable: true })
	roomLogo: string;

	@Column({ length: 255 })
	roomName: string;

	@Column({ default: 0 })
	roomNeedPassword: number;

	@Column({ length: 255, nullable: true })
	roomPassword: string;

	@Column({ length: 255, default: '房间空空如也呢' })
	roomNotice: string;

	@Column({ length: 255, nullable: true })
	roomBg: string;
}
