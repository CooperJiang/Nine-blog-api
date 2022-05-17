import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity({ name: 'tb_collect' })
export class CollectEntity extends BaseEntity {
	@Column({ comment: '用户ID' })
	userId: number;

	@Column({ default: 1, comment: '收藏类型,[1:音乐，2:文章，3:工具，4:导航，5:项目]' })
	typeId: number;

	@Column({ nullable: true, comment: '歌曲ID' })
	mid: number;

	@Column({ nullable: true, comment: '文章ID' })
	articleId: number;

	@Column({ nullable: true, comment: '工具ID' })
	toolId: number;

	@Column({ nullable: true, length: 255, comment: '收藏的歌曲封面图片' })
	pic: string;

	@Column({ nullable: true, length: 255, comment: '收藏的歌曲专辑名称' })
	artist: string;

	@Column({ nullable: true, length: 255, comment: '收藏的歌曲歌手名称' })
	album: string;

	@Column({ nullable: true, length: 255, comment: '收藏的歌曲歌曲名称' })
	name: string;

	@Column({ nullable: true, default: 0, comment: '是否未删除 1:删除' })
	delete: number;
}
