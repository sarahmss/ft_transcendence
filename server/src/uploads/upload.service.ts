import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
const fs = require('fs');

@Injectable()
export class UploadsService {
  constructor() {}

  async getFile(userId: string): Promise<string> {
    const qrCodeLink = `/uploads/${userId}/qrcode.png`;
    const filePath = join(process.cwd(), qrCodeLink);

    if (fs.existsSync(filePath)) {
      return filePath;
    } else {
      throw new NotFoundException();
    }
  }

  async getProfilePicture(userId: string, filename: string): Promise<string> {
		const filePath = join(process.cwd(), `uploads/${userId}/profilePictures/${filename}`);

    if (fs.existsSync(filePath)) {
      return filePath;
    } else {
      throw new NotFoundException();
    }
  }


}
