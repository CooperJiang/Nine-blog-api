import { resolve } from 'path';
import * as COS from 'cos-nodejs-sdk-v5';
import config from '../config/upload';
const { SecretId, SecretKey, Bucket, Region } = config;

const MIMEType = {
	'image/jpeg': 'jpeg',
	'image/png': 'png',
	'image/svg+xml': 'svg',
	'image/webp': 'webp',
	'image/gif': 'gif',
	'application/pdf': 'pdf',
	'application/msword': 'doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
	'application/vnd.ms-excel': 'xls',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

const cos = new COS({
	SecretId,
	SecretKey,
});

/**
 * @desc 上传文件
 * @params filename 文件名
 * @params buffer 文件转为buffer格式
 */
export const putFile = async ({ filename, buffer, dir }) => {
	return new Promise((resolve, reject) => {
		cos.putObject(
			{
				Bucket,
				Region,
				Key: `${dir}/${filename}`,
				StorageClass: 'STANDARD',
				Body: buffer,
				// onProgress: function(progressData) {
				//     console.log(JSON.stringify(progressData),'上传频率');
				// }
			},
			function (err, data) {
				if (err) {
					return reject(err);
				}
				return resolve(data);
			},
		);
	});
};

/**
 * 上传文件到cdn
 * @param param0
 * @returns
 */
export const saveFile = async ({ filename, buffer, dir = 'blog' }) => {
	filename = new Date().getTime() + filename;
	const res: any = await putFile({ filename, buffer, dir });
	return res.Location.replace(/^(http:\/\/|https:\/\/|\/\/|)(.*)/, 'https://$2');
};
