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
import { UsersService } from "src/users/users.service";
import { UploadsService } from "./upload.service";
const fs = require('fs');

@Controller('uploads')
export class UploadsController {
	constructor(
		private usersService: UsersService,
    private uploadService: UploadsService,
		) {}

    @Get(':userId/:path')
    async getFile(@Res() res: Response, @Param('userId', ParseUUIDPipe) userId: string): Promise<void> {
      try {
        const filePath = await this.uploadService.getFile(userId);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"');
        res.sendFile(filePath);
      } catch (error) {
        if (error instanceof NotFoundException) {
          res.status(404).send('File not found');
        } else {
          res.status(500).send('Internal Server Error');
        }
      }
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
			@UploadedFile( new ParseFilePipe({ validators: [
					new MaxFileSizeValidator({ maxSize: 1000000 }),
					new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' }),
				  ], }),)
      file: Express.Multer.File,
      @Param('userId') userId: string): Promise<any> {
        const url = `/uploads/${userId}/profilePictures/${file.filename}`
        return {url:url};
      }

  @Get('/:userId/profilePictures/:filename')
  async getProfilePicture(
    @Param('userId') userId: string,
    @Param('filename') filename: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const filePath = await this.uploadService.getProfilePicture(userId, filename);
      res.sendFile(filePath);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).send('File not found');
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }

}
