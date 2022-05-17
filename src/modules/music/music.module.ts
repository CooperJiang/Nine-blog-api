import { CollectEntity } from './../collect/collect.entity';
import { SpiderService } from './../spider/spider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MusicEntity } from './music.entity';

@Module({
	imports: [TypeOrmModule.forFeature([MusicEntity, CollectEntity])],
	controllers: [MusicController],
	providers: [MusicService, SpiderService],
})
export class MusicModule {}
