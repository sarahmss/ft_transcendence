import { Module } from '@nestjs/common';
import { UploadsController } from './upload.controller';
import { UsersModule } from 'src/users/users.module';
import { UploadsService } from './upload.service';

@Module({
	imports: [UsersModule],
	controllers: [UploadsController],
	providers:[UploadsService]
})
export class UploadsModule {}


