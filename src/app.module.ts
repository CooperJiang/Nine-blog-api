import { EmailModule } from './modules/email/email.module';
import { TasksModule } from './tasks/tasks.module';
import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { resolve } from 'path';
import { TypeModule } from './modules/type/type.module';
import { TagModule } from './modules/tag/tag.module';
import { ArticleModule } from './modules/article/article.module';
import { SpiderModule } from './modules/spider/spider.module';
import { ResourceTypeModule } from './modules/resource-type/resource-type.module';
import { ResourceModule } from './modules/resource/resource.module';
import { CommentModule } from './modules/comment/comment.module';
import { FriendLinksModule } from './modules/friend-links/friend-links.module';
import { ProjectModule } from './modules/project/project.module';
// import { WsChatGateway } from './modules/chat/chat.getaway';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nest-modules/mailer';
// import statusMonitorConfig from './config/statusMonitor';
// import { StatusMonitorModule } from 'nest-status-monitor';
import { RedisModule } from 'nestjs-redis';
import { CacheService } from './cache/cache.service';
import { MusicModule } from './modules/music/music.module';
import { ChatModule } from './modules/chat/chat.module';
import { UploadModule } from './modules/upload/upload.module';
import { VerifyModule } from './modules/verify/verify.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { ToolsModule } from './modules/tools/tools.module';
import { ToolsTypeModule } from './modules/tools-type/tools-type.module';
import { CollectModule } from './modules/collect/collect.module';

@Module({
	imports: [
		// StatusMonitorModule.setUp(statusMonitorConfig),
		ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
		TypeOrmModule.forRootAsync({
			useFactory: (config: ConfigService) => config.get('database'),
			inject: [ConfigService],
		}),
		MailerModule.forRootAsync({
			useFactory: (config: ConfigService) => config.get('email'),
			inject: [ConfigService],
		}),
		// RedisModule.forRootAsync({
		//   useFactory: (configService: ConfigService) => configService.get('redis'),         // or use async method
		//   inject:[ConfigService]
		// }),
		ScheduleModule.forRoot(),
		UserModule,
		TypeModule,
		TagModule,
		SpiderModule,
		ArticleModule,
		ResourceTypeModule,
		ResourceModule,
		CommentModule,
		FriendLinksModule,
		ProjectModule,
		TasksModule,
		EmailModule,
		MusicModule,
		ChatModule,
		UploadModule,
		VerifyModule,
		StatisticsModule,
		ToolsModule,
		ToolsTypeModule,
		CollectModule,
	],
	providers: [],
})
export class AppModule {}
