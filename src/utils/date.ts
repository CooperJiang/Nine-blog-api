import * as moment from 'moment';

export const formatDate = (dateNum: string | number): string => {
	return moment(dateNum).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * @desc 格式化百度统计请求入参
 * @param dateNum
 * @returns
 */
export const formatBaiduReq = (dateNum: string | number): string => {
	return moment(dateNum).format('YYYYMMDD');
};
