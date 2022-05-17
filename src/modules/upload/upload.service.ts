import { Injectable } from '@nestjs/common';
import { saveFile } from '../../lib/file';

@Injectable()
export class UploadService {
	// TODO 目前上传均为公共文件，私有文件接口待开发
	async upload(file) {
		const { originalname: filename, buffer, size } = file;
		return await saveFile({ filename, buffer });
	}
}
