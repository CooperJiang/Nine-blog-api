import { MailerService } from '@nest-modules/mailer';
import { VerifyEntity } from './../verify/verify.entity';
import { randomAvatar } from './../../constant/avatar';
import { UserEntity } from './user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomCode } from 'src/utils/tools';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly UserModle: Repository<UserEntity>,
		@InjectRepository(VerifyEntity)
		private readonly VerifyModle: Repository<VerifyEntity>,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService,
	) {}

	/**
	 * @desc 账号注册
	 * @param params
	 * @param isUseEmailVer 是否使用邮箱验证由用户决定  否则验证过于繁琐 强制验证则前端不传这个参数即可 true：不验证 false：验证
	 * @returns
	 */
	async register(params) {
		const { username, password, email, avatar, isUseEmailVer } = params;
		params.password = hashSync(password);
		if (!avatar) {
			params.avatar = randomAvatar();
		}
		const u: any = await this.UserModle.findOne({
			where: [{ username }, { email }],
		});
		if (u) {
			const tips = username == u.username ? '用户名' : '邮箱';
			throw new HttpException({ message: `该${tips}已经存在了！` }, HttpStatus.BAD_REQUEST);
		}
		!isUseEmailVer && (params.status = 0); // 使用邮箱验证的情况 默认账号是冻结状态
		const newUser = await this.UserModle.save(params);
		/* 需要邮箱验证 */
		if (!isUseEmailVer) {
			const code = randomCode(8);
			const expirationTime = (new Date().getTime() + 60 * 5 * 1000).toString();
			const params = { code, email, type: 'register', expirationTime };
			await this.VerifyModle.save(params);
			const baseApi = 'https://api.jiangly.com'; // 暂时不加测试环境
			await this.mailerService.sendMail({
				to: email,
				from: 'Nine_Team@163.com',
				subject: '来自Nine聊天室的注册验证',
				html: `<span style="padding:15px; display: flex; justify-content: center; flex-direction: column; background: #eee; width: 400px;border-radius: 15px;">
                <b>Nine Team 邮箱验证码</b>
                <p>请点下以下链接激活您的账号，<a href="${baseApi}/api/verify/accountActive?code=${code}&email=${email}" style="color: #5ead22;">点此激活您的账号</a></p>
                <span style="padding: 0; font-size: 12px; color: #ccc;">来自 --小九的博客</span>
              </span>`,
				template: './welcome',
				// context: {
				//   // url: '',
				// },
			});
			return '请前往邮箱激活您的账号用户登录系统！';
		} else {
			return newUser;
		}
	}

	/**
	 * @desc 账号登录
	 * @param params
	 * @returns
	 */
	async login(params): Promise<any> {
		const { username, password } = params;
		const u: any = await this.UserModle.findOne({
			where: [{ username }, { email: username }],
		});
		if (!u) {
			throw new HttpException('该用户不存在！', HttpStatus.BAD_REQUEST);
		}
		const bool = await compareSync(password, u.password);
		if (bool && u.status === 1) {
			const { username, email, id: userId, role, nickname, avatar, sign, roomBg, roomId } = u;
			return {
				token: this.jwtService.sign({ username, nickname, email, userId, role, avatar, sign, roomBg, roomId }),
			};
		} else {
			throw new HttpException(
				{ message: '账号密码错误、或账号未激活！', error: 'please try again later.' },
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	async getInfo(payload) {
		const { userId: id, exp: failure_time } = payload;
		const u = await this.UserModle.findOne({
			where: { id },
			select: ['username', 'nickname', 'email', 'avatar', 'role', 'sign', 'roomBg', 'roomId'],
		});
		return { userInfo: Object.assign(u, { userId: id }), failure_time };
	}

	/**
	 * @desc 密码校验,用于local策略，现在使用全局AuthGuard，暂时不用
	 * @param username
	 * @param password
	 * @returns
	 */
	async validateUser(username: string, password: string) {
		const u: any = await this.UserModle.findOne({
			where: { username },
		});
		const bool = compareSync(password, u.password);
		if (bool) {
			return u;
		} else {
			return false;
		}
	}

	async query(params) {
		const { page = 1, pageSize = 10, role } = params;
		const where: any = {};
		role && (where.role = In(role));
		const rows = await this.UserModle.find({
			order: { id: 'DESC' },
			where,
			skip: (page - 1) * pageSize,
			take: pageSize,
			cache: true,
			select: ['id', 'nickname'],
		});
		const count = await this.UserModle.count();
		return { rows, count };
	}

	async update(payload, params) {
		const { userId: id } = payload;
		const { avatar, username, nickname, roomBg, sign } = params;
		const upateInfoData: any = {};
		avatar && (upateInfoData.avatar = avatar);
		username && (upateInfoData.username = username);
		nickname && (upateInfoData.nickname = nickname);
		roomBg && (upateInfoData.roomBg = roomBg);
		sign && (upateInfoData.sign = sign);
		await this.UserModle.update({ id }, upateInfoData);
		return '修改成功';
	}

	async userList(params) {
		const { page = 1, pageSize = 10, role, status, keyword } = params;
		const basicWhere: any = {};
		status && (basicWhere.status = status);
		status === 0 && (basicWhere.status = status);
		role && (basicWhere.role = role);
		let where: any = [];
		/* 关键词查询多个类型 或的关系 */
		if (keyword) {
			where.push({ ...basicWhere, ...{ username: Like(`%${keyword}%`) } });
			where.push({ ...basicWhere, ...{ nickname: Like(`%${keyword}%`) } });
			where.push({ ...basicWhere, ...{ email: Like(`%${keyword}%`) } });
		} else {
			where = basicWhere;
		}

		const rows = await this.UserModle.find({
			where,
			order: { id: 'DESC' },
			skip: (page - 1) * pageSize,
			take: pageSize,
			cache: true,
		});
		const count = await this.UserModle.count({ where });
		return { rows, count };
	}

	async updateUserInfo(payload, params) {
		const roleGradeMap = {
			admin: 1,
			super: 2,
			guest: 3,
			viewer: 4,
		};
		const { id, status, email, username, nickname, sex, role, sign } = params;
		const { role: mineRole, userId: mineId } = payload;
		const updateUserInfo = await this.UserModle.findOne({ id });
		/* 自己修改自己信息的话，其他可以修改 权限不能给个提示 */
		if (mineId === id && role) {
			throw new HttpException(
				{ message: '不要尝试修改自己的权限等级哦', error: 'please try again later.' },
				HttpStatus.BAD_REQUEST,
			);
		}
		/* 数字越小等级越大 */
		if (roleGradeMap[updateUserInfo.role] <= roleGradeMap[mineRole]) {
			throw new HttpException(
				{ message: '您无权操作和你同级或高于您等级的用户！', error: 'please try again later.' },
				HttpStatus.BAD_REQUEST,
			);
		}
		const updateInfo: any = {};
		status && (updateInfo.status = status);
		status === 0 && (updateInfo.status = status);
		email && (updateInfo.email = email);
		username && (updateInfo.username = username);
		nickname && (updateInfo.nickname = nickname);
		sex && (updateInfo.sex = sex);
		role && (updateInfo.role = role);
		sign && (updateInfo.sign = sign);
		const { affected } = await this.UserModle.update({ id }, updateInfo);
		if (affected > 0) {
			return '修改成功';
		} else {
			throw new HttpException(
				{ message: '修改用户信息失败', error: 'please try again later.' },
				HttpStatus.BAD_REQUEST,
			);
		}
	}
}
