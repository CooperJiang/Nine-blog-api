import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthGuard } from './guard/auth.guard';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSwagger } from './swagger/index';

import * as Dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { join } from 'path';

Dotenv.config({ path: '.env' });
const PORT = process.env.PORT;
const PREFIX = process.env.PREFIX;

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.setGlobalPrefix('/api');
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new TransformInterceptor());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalGuards(new AuthGuard());
	app.useWebSocketAdapter(new IoAdapter(app));
	app.setBaseViewsDir(join(__dirname, '..', 'views'));
	app.setViewEngine('ejs');

	createSwagger(app);
	app.enableCors();
	await app.listen(PORT, () => {
		Logger.log(`服务已经启动,接口请访问:http://localhost:${PORT}`);
		Logger.log(`swagger已经启动,文档请访问:http://localhost:${PORT}${PREFIX}`);
	});
}
bootstrap();
