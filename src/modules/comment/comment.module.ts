import { UserEntity } from './../user/user.entity';
import { CommentEntity } from './comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
	imports: [TypeOrmModule.forFeature([CommentEntity, UserEntity])],
	controllers: [CommentController],
	providers: [CommentService],
})
export class CommentModule {}
