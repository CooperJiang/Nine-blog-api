import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/baseEntity';

@Entity({ name: 'tb_project' })
export class ProjectEntity extends BaseEntity {
	@Column({ comment: '排序ID' })
	orderId: number;

	@Column({ length: 64, comment: '项目名称' })
	name: string;

	@Column({ comment: '项目介绍' })
	desc: string;

	@Column({ comment: '背景图片地址' })
	bgImage: string;

	@Column({ comment: '标签，用,切割存储' })
	tag: string;

	@Column({ comment: '项目开始时间' })
	startTime: Date;

	@Column({ comment: '项目结束时间' })
	endTime: Date;

	@Column({ comment: '项目git地址', nullable: true })
	git: string;

	@Column({ comment: '项目demo示例地址', nullable: true })
	link: string;

	@Column({ comment: '类型：[1:项目，可以跳转到外部  2:博客内部模块，为2就走path本站跳转]', nullable: true })
	type: number;

	@Column({ comment: '本站路径， type == 2 才会有path', nullable: true })
	path: string;

	@Column({ comment: '是否是热门项目 推荐项目  [1: 推荐  -1:默认]', nullable: true })
	hot: number;

	@Column({ comment: '项目状态  [1: 正常  -1:冻结]', nullable: true })
	status: number;
}
