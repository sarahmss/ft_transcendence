import { Controller,
		Get,
		Param,
		Res,
		Post,
		UseInterceptors,
		ParseFilePipe,
		MaxFileSizeValidator,
		FileTypeValidator,
		NotFoundException,
		UploadedFile,
		ParseUUIDPipe} from "@nestjs/common";
import type { Response } from 'express';
import {existsSync,
		mkdirSync } from 'fs';
import { join } from 'path';
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';

const fs = require('fs');

@Controller('uploads')
export class UploadsController {
	@Get(':userId/:path')
		getFile(@Res() res: Response, @Param('userId', ParseUUIDPipe) userId: string): void {
			const qrCodeLink = `/uploads/${userId}/qrcode.png`;
			const filePath = join(process.cwd(), qrCodeLink);

			res.setHeader('Content-Type', 'image/png');
			res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"');

			res.sendFile(filePath);
		}

	@Post(':userId/profilePictures/:path')
		@UseInterceptors(FileInterceptor('file', {
			storage: diskStorage({
					destination: (req, file, cb) =>
					{
						const userId = req.params.userId;
						const profilePicturesPath = join(process.cwd(), `/uploads/${userId}/profilePictures`);
						if (!existsSync(profilePicturesPath)) {
								mkdirSync(profilePicturesPath, { recursive: true });
						}
						cb(null, profilePicturesPath);
					},
					filename: (req, file, cb) => {
						return cb(null, `${file.originalname}`);
					},
			}),
		}))
		async uploadFile(
			@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1000000 }),
					new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' }),
				],
				}),
			)
	file: Express.Multer.File,
	@Param('userId') userId: string): Promise<any>{
	return {url: `/uploads/${userId}/profilePictures/${file.filename}`};
	}

	@Get('/:userId/profilePictures/:filename')
	async getProfilePicture(
			@Param('userId') userId: string,
			@Param('filename') filename: string,
			@Res() res: Response): Promise<void>
	{
		const filePath = join(process.cwd(), `uploads/${userId}/profilePictures/${filename}`);

		if (fs.existsSync(filePath)) {
			res.sendFile(filePath);
		} else {
			throw new NotFoundException();
		}
	}

}
