import { Controller,
		Get,
		Param,
		Res,
		StreamableFile,
		ParseUUIDPipe} from "@nestjs/common";
import { createReadStream } from "fs";
import { UserRequest } from "src/helpers/types.helper";
import { join } from 'path';
import type { Response } from 'express';


@Controller('uploads')
export class UploadsController {
	@Get(':userId/:path')
	getFile(@Res({ passthrough: true }) res: Response,  @Param('userId', ParseUUIDPipe) userId: string ): StreamableFile {
		const qrCodeLink = `/uploads/${userId}/qrcode.png`;
		console.log(`Get uploads ${qrCodeLink}`);
		const file = createReadStream(join(process.cwd(), qrCodeLink));
		res.set({
			'Content-Type': 'image/png',
			'Content-Disposition': 'attachment; filename="package.json"',
		});
		return new StreamableFile(file);
	}

}
