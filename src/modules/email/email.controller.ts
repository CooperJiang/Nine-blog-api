import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
	constructor(private readonly emailService: EmailService) {}

	@Get('/send')
	sendEmail(@Query() { text }) {
		return this.emailService.sendEmail(text);
	}
}
