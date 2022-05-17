import { AccountActiveDto } from './dto/login.user.dto';
import { VerifyService } from './verify.service';
import { Controller, Get, Query, Render, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Verify')
@Controller('verify')
export class VerifyController {
	constructor(private readonly VerifyService: VerifyService) {}

	@Get('/accountActive')
	accountActive(@Query() params: AccountActiveDto, @Response() res) {
		return this.VerifyService.accountActive(params, res);
	}

	@Get('/verifySuccess')
	@Render('account/verify_success')
	verifySuccess(@Query() params) {
		const { nickname, count } = params;
		return { nickname, count };
	}

	@Get('/verifyError')
	@Render('account/verify_error')
	verifyError(@Query() params) {
		return {};
	}
}
