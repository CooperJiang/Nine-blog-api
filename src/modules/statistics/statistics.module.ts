import { FriendLinksEntity } from './../friend-links/friend-links.entity';
import { TypeEntity } from './../type/type.entity';
import { CommentEntity } from './../comment/comment.entity';
import { ArticleEntity } from './../article/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { MessageEntity } from '../chat/message.entity';
import { UserEntity } from '../user/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ArticleEntity, CommentEntity, MessageEntity, TypeEntity, FriendLinksEntity, UserEntity]),
	],
	controllers: [StatisticsController],
	providers: [StatisticsService],
})
export class StatisticsModule {}
