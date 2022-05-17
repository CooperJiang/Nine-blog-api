import * as https from 'https';

export const https_get = async (url) => {
	let pipe = null;
	return new Promise((resovle, reject) => {
		https.get(url, (res) => {
			if (res.statusCode == 200) {
				res.on('data', (chunk) => {
					pipe += chunk;
				});
				res.on('end', () => {
					const { data } = JSON.parse(pipe.split('null')[1]);
					if (data.length) {
						const { origip, location } = data[0];
						resovle({ ip: origip, address: location.split(' ')[0] });
					} else {
						reject('获取ip失败');
					}
				});
			} else {
				reject('获取ip失败');
			}
		});
	});
};

/**
 * @desc 转会数据格式，把映射对象转为数组 并把房主放到首位
 * @param onlineUserInfo
 * @returns
 */
export const formatOnlineUser = (onlineUserInfo = {}) => {
	const keys = Object.keys(onlineUserInfo);
	if (!keys.length) return [];
	let userInfo = Object.values(onlineUserInfo);
	let homeowner = null;
	const homeownerIndex = userInfo.findIndex((k: any) => k.role === 'admin');
	homeownerIndex != -1 && (homeowner = userInfo.splice(homeownerIndex, 1));
	homeownerIndex != -1 && (userInfo = [...homeowner, ...userInfo]);
	return userInfo;
};

/**
 * @desc 延迟请求，爬虫遍历请求过快会导致被拉黑
 * @param time  时间 ms
 * @returns null
 */
export const delayRequest = (time) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});
};

/**
 * @desc 当前当前时间戳/1000  按秒计算
 * @params lastTimespace  传入上次时间戳则计算时间与现在的插值
 * @returns
 */
export const getTimeSpace = (lastTimespace = 0) => {
	const nowSpace = Math.round(new Date().getTime() / 1000);
	return lastTimespace ? nowSpace - lastTimespace : nowSpace;
};

/**
 * @desc 随机生成验证码
 * @param len  验证码长度
 * @returns
 */
export const randomCode = (len = 6) => {
	let code = '';
	for (let i = 0; i < len; i++) {
		const radom = Math.floor(Math.random() * 10);
		code += radom;
	}
	return code;
};

/**
 * @desc 去除空参数，返回正确查询条件
 * @param arg
 */
export const delEmptyCondition = (arg) => {
	const result: any = {};
	Object.keys(arg).forEach((key) => {
		arg[key] && (result[key] = arg[key]);
	});
	return result;
};

/**
 * @desc 取到其中唯一一个非空值的key
 * @param arg
 */
export const getNotEmptyKey = (arg) => {
	let result = null;
	Object.keys(arg).forEach((key) => {
		arg[key] && (result = key);
	});
	return result;
};
