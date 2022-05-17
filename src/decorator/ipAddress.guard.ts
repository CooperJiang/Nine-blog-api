import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import * as requestIp from 'request-ip';
import { https_get } from '../utils/tools';

export const IpAddress = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest();
	let ip = req.clientIp || requestIp.getClientIp(req);
	/* TODO 待解决 docker部署中暂时没拿到真实ip 先从客户端上传  */
	if (ip.substr(0, 7) == '::ffff:') {
		ip = ip.substr(7);
	}

	console.log(ip, '最后拿到的ip');
	// ip='139.226.99.52'
	const url = `https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=%22+${ip}+%22&co=&resource_id=6006&t=1555898284898&ie=utf8&oe=utf8&format=json&tn=baidu`;
	try {
		const res: any = await https_get(url);
		return res;
	} catch (error) {
		return { ip: null, address: null };
	}
});
