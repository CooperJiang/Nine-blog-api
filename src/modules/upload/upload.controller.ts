import { UploadService } from './upload.service';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
	constructor(private readonly UploadService: UploadService) {}

	@Post('/file')
	@UseInterceptors(FileInterceptor('file'))
	upload(@UploadedFile() file) {
		return this.UploadService.upload(file);
	}
}
