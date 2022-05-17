import { ToolsEntity } from './../tools/tools.entity';
import { ToolsTypeEntity } from './tools-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ToolsTypeController } from './tools-type.controller';
import { ToolsTypeService } from './tools-type.service';

@Module({
	imports: [TypeOrmModule.forFeature([ToolsTypeEntity, ToolsEntity])],
	controllers: [ToolsTypeController],
	providers: [ToolsTypeService],
})
export class ToolsTypeModule {}
