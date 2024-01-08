import { Module } from '@nestjs/common';
import { UploadsController } from './upload.controller';
import { UsersModule } from 'src/users/users.module';


@Module({
	imports: [UsersModule],
	controllers: [UploadsController],
})
export class UploadsModule {}


