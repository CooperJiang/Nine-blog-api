import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
	private readonly logger = new Logger(TasksService.name);

	/**
	 * @desc 每晚更新一次热门音乐列表，每天更新30首用于chat大厅播放
	 */
	// @Cron('30 * * * * *')
	// handleCron() {
	//   this.logger.debug('Called when the second is 45');
	// }
}
