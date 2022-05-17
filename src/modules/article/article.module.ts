import { CollectEntity } from './../collect/collect.entity';
import { TagEntity } from './../tag/tag.entity';
import { TypeEntity } from './../type/type.entity';
import { UserEntity } from './../user/user.entity';
import { CommonService } from './../common/common.service';
import { ArticleEntity } from './article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';

@Module({
	imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, TypeEntity, TagEntity, CollectEntity])],
	providers: [ArticleService, CommonService],
	controllers: [ArticleController],
})
export class ArticleModule {}
