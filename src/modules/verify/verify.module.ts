import { UserEntity } from './../user/user.entity';
import { VerifyEntity } from './verify.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { VerifyController } from './verify.controller';
import { VerifyService } from './verify.service';

@Module({
	imports: [TypeOrmModule.forFeature([VerifyEntity, UserEntity])],
	controllers: [VerifyController],
	providers: [VerifyService],
})
export class VerifyModule {}
