import { FriendLinksEntity } from './friend-links.entity';
import { FriendLinksService } from './friend-links.service';
import { FriendLinksController } from './friend-links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
	imports: [TypeOrmModule.forFeature([FriendLinksEntity])],
	controllers: [FriendLinksController],
	providers: [FriendLinksService],
})
export class FriendLinksModule {}
