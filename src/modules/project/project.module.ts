import { ProjectController } from './project.controller';
import { ProjectEntity } from './projtct.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectEntity])],
	controllers: [ProjectController],
	providers: [ProjectService],
})
export class ProjectModule {}
