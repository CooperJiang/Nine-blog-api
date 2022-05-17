import { ResourceTypeEntity } from '../resource-type/resource-type.entity';
import { ResourceEntity } from './resource.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
	imports: [TypeOrmModule.forFeature([ResourceEntity, ResourceTypeEntity])],
	controllers: [ResourceController],
	providers: [ResourceService],
})
export class ResourceModule {}
