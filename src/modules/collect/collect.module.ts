import { ArticleEntity } from './../article/article.entity';
import { CollectEntity } from './collect.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CollectController } from './collect.controller';
import { CollectService } from './collect.service';

@Module({
	imports: [TypeOrmModule.forFeature([CollectEntity, ArticleEntity])],
	controllers: [CollectController],
	providers: [CollectService],
})
export class CollectModule {}
