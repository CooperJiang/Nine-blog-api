import { UserEntity } from './../user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entity/baseEntity';

@Entity({ name: 'tb_article' }) //数据表的名字
export class ArticleEntity extends BaseEntity {
	@Column({ length: 32, unique: true, comment: '文章标题' })
	title: string;

	@Column({ length: 300, comment: '文章描述' })
	desc: string;

	@Column({ type: 'text', comment: '文章内容' })
	content: string;

	@Column({ comment: '状态' })
	status: number;

	@Column({ comment: '用户ID' })
	userId: number;

	@Column({ comment: '分类ID' })
	typeId: number;

	@Column({ comment: '标签ID ,相连' })
	tagId: string;

	@Column({ comment: '文章封面图片' })
	coverImg: string;

	@Column({ nullable: true, comment: '排序ID' })
	orderId: number;

	@Column({ length: 300, nullable: true, comment: '背景音乐' })
	bgMusic: string;

	@Column({ nullable: true, default: 0, comment: '阅读量' })
	readVolume: number;

	@Column({ nullable: true, default: 0, comment: '收藏人数' })
	collectionVolume: number;

	@Column({ nullable: true, default: 1, comment: '布局显示方式' })
	layoutMode: number;

	@Column({ nullable: true, default: 1, comment: '是否自动播放背景音乐 1:是 其他:不是' })
	autoPlay: number;

	@ManyToOne(() => UserEntity)
	user: UserEntity;
}
