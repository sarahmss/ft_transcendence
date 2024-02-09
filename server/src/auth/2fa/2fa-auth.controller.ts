import { Response } from 'express';
import { UserRequest } from "src/helpers/types.helper";
import { TwoFaAuthService } from "./2fa-auth.service";
import { TwoFaAuthDto } from "./dto/2fa-auth.dto";
import { JwtService } from "@nestjs/jwt";
import {
	Body,
	Controller,
	Get,
	Post,
	BadRequestException,
	Query,
	Req,
	Res,
	ParseUUIDPipe
} from "@nestjs/common";
import { MessagesHelper } from "src/helpers/messages.helpers";
import { UsersService } from '../../users/users.service';

@Controller("2fa-auth")
	export class TwoFaAuthController {
		constructor(
			private _2faService: TwoFaAuthService,
			private _jwtService: JwtService,
			private usersService: UsersService,
		){}

		/********************************* GET ******************************/
		@Get('generate')
		async generate(@Res() response: Response, @Req() request: UserRequest) {
			const userId = request.user;
			this._2faService.createQrCode(userId);
			return(response.status(200).send({ url: process.env.BACK_URL + `/uploads/${userId}/qrcode.png`}));
		}

		/********************************* POST ******************************/
		@Post('enable')
		async enable(@Req() request: UserRequest, @Body() body: TwoFaAuthDto) {
			const userId = request.user;
			return this._2faService.SetTwoFactorAuthOn(userId, body.code);
		}

		@Post('disable')
		async disable(@Req() request: UserRequest, @Body() body: TwoFaAuthDto) {
			const userId = request.user;
			return this._2faService.SetTwoFactorAuthOff(userId, body.code);
		}

		@Post('login')
		async login(
			@Query('user', ParseUUIDPipe) userId: string,
			@Body() body: TwoFaAuthDto,
			@Res() response: Response,)
			{
				const isValid = await this._2faService.checkQrCode(userId,
																body.code);
				if (isValid == false) {
				throw new BadRequestException(MessagesHelper.INVALID_QR_CODE);
				}
				const token = this._jwtService.sign({ id: userId });
				response.cookie('accessToken',
									token,
									{sameSite: 'lax', });
				this.usersService.setStatusOn(userId);	
				return response.status(200).json({
					cookie: response.getHeader('set-cookie'),
				});
			}
		}
