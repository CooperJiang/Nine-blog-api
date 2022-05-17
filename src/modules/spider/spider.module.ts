import { Module } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { SpiderController } from './spider.controller';

@Module({
	providers: [SpiderService],
	controllers: [SpiderController],
})
export class SpiderModule {}
